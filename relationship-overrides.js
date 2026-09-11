(()=>{
  const P=window.GEDCOM_PARENTS||{},S=window.GEDCOM_SPOUSES||{};
  // Confirmed family correction: I101 Mary spouse is I126 Thanasingh.
  S['@I101@']=['@I126@'];
  S['@I126@']=['@I101@'];
  // I102 and I103 remain children of I101 Mary + I126 Thanasingh.
  P['@I102@']=['@I101@','@I126@'];
  P['@I103@']=['@I101@','@I126@'];
  // I104 Ravi is spouse of I102 Sheroline Gnana Ketchial.
  S['@I102@']=['@I104@'];
  S['@I104@']=['@I102@'];
  P['@I105@']=['@I104@','@I102@'];
  P['@I106@']=['@I104@','@I102@'];
  delete S['@I104'];
  window.GEDCOM_PARENTS=P;
  window.GEDCOM_SPOUSES=S;
  window.render?.();
})();
