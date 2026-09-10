function renderTemplate(body, values) {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const v = values[key];
    return (v === undefined || v === null || v === '') ? `[${key}]` : String(v);
  });
}

module.exports = { renderTemplate };
