function convertNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const children = Array.from(element.childNodes).map(convertNode).join("");

  switch (element.tagName) {
    case "P":
      return children ? `${children}\n\n` : "";
    case "STRONG":
    case "B":
      return `**${children}**`;
    case "EM":
    case "I":
      return `*${children}*`;
    case "A":
      return `[${children}](${element.getAttribute("href") ?? ""})`;
    case "H1":
      return `# ${children}\n\n`;
    case "H2":
      return `## ${children}\n\n`;
    case "H3":
      return `### ${children}\n\n`;
    case "UL":
      return `${Array.from(element.children)
        .map((item) => `- ${convertNode(item).trim()}`)
        .join("\n")}\n\n`;
    case "OL":
      return `${Array.from(element.children)
        .map((item, index) => `${index + 1}. ${convertNode(item).trim()}`)
        .join("\n")}\n\n`;
    case "LI":
      return children;
    case "IMG":
      return `![${element.getAttribute("alt") ?? ""}](${element.getAttribute("src") ?? ""})`;
    case "BR":
      return "\n";
    case "BLOCKQUOTE":
      return `> ${children.trim()}\n\n`;
    case "CODE":
      return element.parentElement?.tagName === "PRE" ? children : `\`${children}\``;
    case "PRE":
      return `\n\`\`\`\n${children}\n\`\`\`\n\n`;
    default:
      return children;
  }
}

/** Best-effort HTML to Markdown serializer for editor output previews. */
export function richTextHtmlToMarkdown(html: string): string {
  if (!html.trim()) {
    return "";
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return convertNode(doc.body).trim();
}
