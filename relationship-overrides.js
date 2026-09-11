(()=>{
  const P=window.GEDCOM_PARENTS||{},S=window.GEDCOM_SPOUSES||{};
  // Confirmed family corrections: I101 ↔ I126; their children are I102 and I103.
  P['@I102@']=['@I101@','@I126@'];
  P['@I103@']=['@I101@','@I126@'];
  S['@I101@']=['@I126@'];
  S['@I126@']=['@I101@'];
  // I104 ↔ I102; their children are I105 and I106.
  S['@I102@']=['@I104@'];
  S['@I104@']=['@I102@'];
  P['@I105@']=['@I104@','@I102@'];
  P['@I106@']=['@I104@','@I102@'];
  delete S['@I104'];
  window.GEDCOM_PARENTS=P;
  window.GEDCOM_SPOUSES=S;
  window.render?.();
})();
