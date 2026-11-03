// 이메일 본문에 넣을 글을 안전하게 바꿉니다. (&, <, >, " 를 그대로 쓰면 메일이 깨지거나 악용될 수 있어요)
export const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
