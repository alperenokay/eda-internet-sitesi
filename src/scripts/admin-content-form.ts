/** Admin CMS içerik formu: toplama, liste satırları, kaydet. */
const inputClass =
  "block w-full rounded-[var(--radius-sm)] border border-line bg-paper px-3 py-2 text-sm";

function setDeepValue(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    if (/^\d+$/.test(nextKey)) {
      if (!Array.isArray(cur[key])) cur[key] = [];
    } else if (!cur[key] || typeof cur[key] !== "object") {
      cur[key] = {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

function getDeepValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((cur, key) => {
    if (cur == null || typeof cur !== "object") return undefined;
    if (/^\d+$/.test(key)) return (cur as unknown[])[Number(key)];
    return (cur as Record<string, unknown>)[key];
  }, obj);
}

function readInitialData(): Record<string, unknown> {
  const initialEl = document.getElementById("content-initial");
  const raw = initialEl?.textContent?.trim() || "{}";
  return JSON.parse(raw) as Record<string, unknown>;
}

function collectFormData(form: HTMLFormElement): Record<string, unknown> {
  const data = readInitialData();

  form.querySelectorAll("[data-field]").forEach((el) => {
    const path = el.getAttribute("data-field");
    if (!path) return;
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      setDeepValue(data, path, el.checked);
    } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      setDeepValue(data, path, el.value);
    }
  });

  reindexListFields(form, data);
  return data;
}

function reindexListFields(form: HTMLFormElement, data: Record<string, unknown>) {
  form.querySelectorAll("fieldset[data-list-path]").forEach((fieldset) => {
    const path = fieldset.getAttribute("data-list-path");
    if (!path) return;
    const rows = fieldset.querySelectorAll(".list-row");
    const items: Record<string, string>[] = [];
    rows.forEach((row) => {
      const hrefEl = row.querySelector('[data-field$=".href"]') as HTMLInputElement | null;
      const labelEl = row.querySelector('[data-field$=".label"]') as HTMLInputElement | null;
      const titleEl = row.querySelector('[data-field$=".title"]') as HTMLInputElement | null;
      const textEl = row.querySelector('[data-field$=".text"]') as HTMLTextAreaElement | null;
      if (titleEl && textEl) {
        items.push({ title: titleEl.value.trim(), text: textEl.value.trim() });
      } else if (hrefEl && labelEl) {
        items.push({ href: hrefEl.value.trim(), label: labelEl.value.trim() });
      }
    });
    setDeepValue(
      data,
      path,
      items.filter((item) => Object.values(item).some(Boolean))
    );
  });
}

function renumberListRow(row: Element, path: string, index: number, listType: string) {
  if (listType === "titleText") {
    row.querySelector('[data-field$=".title"]')?.setAttribute("data-field", `${path}.${index}.title`);
    row.querySelector('[data-field$=".text"]')?.setAttribute("data-field", `${path}.${index}.text`);
  } else {
    row.querySelector('[data-field$=".href"]')?.setAttribute("data-field", `${path}.${index}.href`);
    row.querySelector('[data-field$=".label"]')?.setAttribute("data-field", `${path}.${index}.label`);
  }
}

function renumberList(fieldset: Element) {
  const path = fieldset.getAttribute("data-list-path");
  const listType = fieldset.querySelector(".list-add")?.getAttribute("data-list-type") || "nav";
  if (!path) return;
  fieldset.querySelectorAll(".list-row").forEach((row, index) => {
    renumberListRow(row, path, index, listType);
  });
}

function createNavRow(path: string, index: number) {
  const row = document.createElement("div");
  row.className = "list-row grid gap-2 sm:grid-cols-[1fr_1fr_auto]";
  row.innerHTML = `
    <input type="text" data-field="${path}.${index}.href" placeholder="/ornek" class="${inputClass}" />
    <input type="text" data-field="${path}.${index}.label" data-rich-input placeholder="Menü metni" class="${inputClass}" />
    <button type="button" class="list-remove text-sm text-red-700">Kaldır</button>
  `;
  return row;
}

function createTitleTextRow(path: string, index: number) {
  const row = document.createElement("div");
  row.className = "list-row space-y-2 rounded-[var(--radius-sm)] border border-line/70 p-3";
  row.innerHTML = `
    <input type="text" data-field="${path}.${index}.title" data-rich-input placeholder="Başlık" class="${inputClass}" />
    <textarea data-field="${path}.${index}.text" data-rich-input rows="2" placeholder="Metin" class="${inputClass}"></textarea>
    <button type="button" class="list-remove text-sm text-red-700">Kaldır</button>
  `;
  return row;
}

function applyDataToForm(form: HTMLFormElement, data: Record<string, unknown>) {
  form.querySelectorAll("[data-field]").forEach((el) => {
    const path = el.getAttribute("data-field");
    if (!path) return;
    const value = getDeepValue(data, path);
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      el.checked = Boolean(value);
    } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value == null ? "" : String(value);
    }
  });
}

function bindListControls() {
  document.querySelectorAll("fieldset[data-list-path]").forEach((fieldset) => {
    if (fieldset.hasAttribute("data-list-bound")) return;
    fieldset.setAttribute("data-list-bound", "true");

    fieldset.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.classList.contains("list-add")) {
        const path = target.getAttribute("data-list-path");
        const listType = target.getAttribute("data-list-type") || "nav";
        const rows = fieldset.querySelector(".list-rows");
        if (!path || !rows) return;
        const index = rows.querySelectorAll(".list-row").length;
        const row =
          listType === "titleText" ? createTitleTextRow(path, index) : createNavRow(path, index);
        rows.appendChild(row);
      }

      if (target.classList.contains("list-remove")) {
        target.closest(".list-row")?.remove();
        renumberList(fieldset);
      }
    });
  });
}

async function saveContentForm(form: HTMLFormElement) {
  const contentKey = form.dataset.contentKey;
  const errorEl = document.getElementById("content-form-error");
  const successEl = document.getElementById("content-form-success");
  const submitBtn = document.getElementById("content-form-submit");

  if (!contentKey || !(submitBtn instanceof HTMLButtonElement)) return;

  errorEl?.classList.add("hidden");
  successEl?.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.textContent = "Kaydediliyor...";

  try {
    const payload = collectFormData(form);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: contentKey, data: payload }),
    });
    const raw = await res.text();
    let result: { ok?: boolean; error?: string; data?: Record<string, unknown> };
    try {
      result = JSON.parse(raw) as typeof result;
    } catch {
      if (errorEl) {
        errorEl.textContent = `Sunucu yanıtı okunamadı (HTTP ${res.status}).`;
        errorEl.classList.remove("hidden");
      }
      return;
    }
    if (result.ok) {
      if (successEl) {
        successEl.textContent = "İçerik kaydedildi.";
        successEl.classList.remove("hidden");
      }
      const initialEl = document.getElementById("content-initial");
      if (initialEl && result.data) {
        initialEl.textContent = JSON.stringify(result.data);
        applyDataToForm(form, result.data);
      }
    } else if (errorEl) {
      errorEl.textContent = result.error || "Kayıt sırasında bir sorun oluştu.";
      errorEl.classList.remove("hidden");
    }
  } catch (err) {
    if (errorEl) {
      const detail = err instanceof Error ? err.message : "";
      errorEl.textContent = detail
        ? `Bağlantı sorunu: ${detail}`
        : "Bağlantı sorunu oluştu.";
      errorEl.classList.remove("hidden");
    }
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Kaydet";
    }
  }
}

function bindContentForm() {
  bindListControls();
  const form = document.getElementById("content-form");
  if (!(form instanceof HTMLFormElement) || form.hasAttribute("data-content-bound")) return;
  form.setAttribute("data-content-bound", "true");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void saveContentForm(form);
  });
}

bindContentForm();
document.addEventListener("astro:page-load", bindContentForm);
