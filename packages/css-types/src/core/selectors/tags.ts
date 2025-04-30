/** https://html.spec.whatwg.org/dev/dom.html#metadata-content */
// Not Selectable type Metadata =
//   | 'base'
//   | 'link'
//   | 'meta'
//   | 'noscript'
//   | 'script'
//   | 'style'
//   | 'template'
//   | 'title';

/** https://html.spec.whatwg.org/dev/semantics.html#the-root-element */
type DocumentRoot = "html" | "body";
// Not Selectable | 'head';

/** https://html.spec.whatwg.org/dev/dom.html#heading-content */
type Heading = `h${1 | 2 | 3 | 4 | 5 | 6}` | "hgroup";

/** https://html.spec.whatwg.org/dev/dom.html#sectioning-content */
type Sectioning = "article" | "aside" | "nav" | "section";

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-li-element */
type ListItem = "li";

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-dt-element */
type DescriptionListTerm = "dt";

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-dd-element */
type DescriptionListDetail = "dd";

/** https://html.spec.whatwg.org/dev/grouping-content.html#the-figcaption-element */
type FigCaption = "figcaption";

/** https://html.spec.whatwg.org/dev/grouping-content.html#grouping-content */
type List = "ol" | "ul" | "menu";
type Grouping =
  | List
  | ListItem
  | DescriptionListTerm
  | DescriptionListDetail
  | FigCaption
  | "p"
  | "hr"
  | "pre"
  | "blockquote"
  | "dl"
  | "figure"
  | "main"
  | "search"
  | "div";

/** https://html.spec.whatwg.org/dev/dom.html#embedded-content-2 */
type Embedded =
  | "audio"
  | "iframe"
  | "embed"
  | "img"
  | "video"
  | "canvas"
  | "math"
  | "object"
  | "picture"
  | "svg";

/** https://html.spec.whatwg.org/dev/tables.html#the-table-element */
type Table =
  | "table"
  | "caption"
  | "colgroup"
  | "thead"
  | "tbody"
  | "tfoot"
  | "tr"
  | "td"
  | "th";

//#region ================[ Interactive ]======================*/
type EmbeddedInteractive = Extract<
  Embedded,
  "audio" | "iframe" | "img" | "embed" | "video"
>;
/** https://html.spec.whatwg.org/dev/dom.html#interactive-content */
type Interactive =
  | "a"
  | "button"
  | "details"
  | "input"
  | "label"
  | "select"
  | "textarea"
  | EmbeddedInteractive;
//#endregion ==================================================*/

//#region ================[ Phrasing ]=========================*/
type PhrasingShared =
  | "abbr"
  | "b"
  | "bdi"
  | "bdo"
  | "cite"
  | "code"
  | "data"
  | "del"
  | "dfn"
  | "em"
  | "i"
  | "ins"
  | "kbd"
  | "map"
  | "mark"
  | "meter"
  | "output"
  | "progress"
  | "q"
  | "ruby"
  | "s"
  | "samp"
  | "small"
  | "span"
  | "strong"
  | "sub"
  | "sup"
  | "time"
  | "u"
  | "var";
/** https://html.spec.whatwg.org/dev/dom.html#phrasing-content */
type Phrasing =
  | Embedded
  | Exclude<Interactive, "details">
  | PhrasingShared
  | "area"
  | "br"
  | "datalist"
  | "link"
  | "meta"
  | "noscript"
  | "script"
  | "slot"
  | "template"
  | "wbr";
//#endregion ==================================================*/

//#region ================[ Flow ]=============================*/
type FlowGrouping = Exclude<Grouping, "dt" | "dd" | "figcaption" | "li">;
type Flow =
  | Heading
  | Sectioning
  | List
  | Interactive
  | Embedded
  | FlowGrouping
  | Phrasing;
//#endregion ==================================================*/

//#region ================[ Palpable ]=========================*/
type PalpableGrouping = Exclude<
  Grouping,
  "li" | "hr" | "dt" | "dd" | "figcaption"
>;
/** https://html.spec.whatwg.org/dev/dom.html#palpable-content */
type Palpable =
  | Heading
  | Sectioning
  | List
  | Interactive
  | PalpableGrouping
  | "fieldset"
  | "figure"
  | "footer"
  | "form"
  | "header"
  | "table";
//#endregion ==================================================*/

type All = DocumentRoot | Grouping | Table | Flow | Palpable;

/** https://html.spec.whatwg.org/dev/dom.html#global-attributes */
type GlobalAttributes =
  | "data-"
  | "class"
  | "id"
  | "slot"
  | "accesskey"
  | "autocapitalize"
  | "autocorrect"
  | "autofocus"
  | "contenteditable"
  | "dir"
  | "draggable"
  | "enterkeyhint"
  | "hidden"
  | "inert"
  | "inputmode"
  | "is"
  | "itemid"
  | "itemprop"
  | "itemref"
  | "itemscope"
  | "itemtype"
  | "lang"
  | "nonce"
  | "popover"
  | "spellcheck"
  | "style"
  | "tabindex"
  | "title"
  | "translate"
  | "writingsuggestions";

type GlobalEventHandlers =
  | "onauxclick"
  | "onbeforeinput"
  | "onbeforematch"
  | "onbeforetoggle"
  | "onblur"
  | "oncancel"
  | "oncanplay"
  | "oncanplaythrough"
  | "onchange"
  | "onclick"
  | "onclose"
  | "oncommand"
  | "oncontextlost"
  | "oncontextmenu"
  | "oncontextrestored"
  | "oncopy"
  | "oncuechange"
  | "oncut"
  | "ondblclick"
  | "ondrag"
  | "ondragend"
  | "ondragenter"
  | "ondragleave"
  | "ondragover"
  | "ondragstart"
  | "ondrop"
  | "ondurationchange"
  | "onemptied"
  | "onended"
  | "onerror"
  | "onfocus"
  | "onformdata"
  | "oninput"
  | "oninvalid"
  | "onkeydown"
  | "onkeypress"
  | "onkeyup"
  | "onload"
  | "onloadeddata"
  | "onloadedmetadata"
  | "onloadstart"
  | "onmousedown"
  | "onmouseenter"
  | "onmouseleave"
  | "onmousemove"
  | "onmouseout"
  | "onmouseover"
  | "onmouseup"
  | "onpaste"
  | "onpause"
  | "onplay"
  | "onplaying"
  | "onprogress"
  | "onratechange"
  | "onreset"
  | "onresize"
  | "onscroll"
  | "onscrollend"
  | "onsecuritypolicyviolation"
  | "onseeked"
  | "onseeking"
  | "onselect"
  | "onslotchange"
  | "onstalled"
  | "onsubmit"
  | "onsuspend"
  | "ontimeupdate"
  | "ontoggle"
  | "onvolumechange"
  | "onwaiting"
  | "onwheel";

export type {
  All,
  DocumentRoot,
  Grouping,
  Table,
  Flow,
  Palpable,
  GlobalAttributes,
  GlobalEventHandlers,
};
