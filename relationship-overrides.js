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

  // Confirmed from family-record screenshots: Baskar + Anus Nesamani -> Kevin Richard.
  S['@I30@']=['@I158@'];
  S['@I158@']=['@I30@'];
  P['@I159@']=['@I30@','@I158@'];

  // Confirmed from family-record screenshots: Christy Mary Shanthi Alwyn + Paul Alwin -> Celestina Gabriella Alwyn, Jeffrey Infanta Alwyn.
  S['@I31@']=['@I160@'];
  S['@I160@']=['@I31@'];
  P['@I161@']=['@I31@','@I160@'];
  P['@I162@']=['@I31@','@I160@'];

  // Confirmed from family-record screenshots: Jeba Anandhi + Jeyasing Pandian -> Judson, Janat Sharon.
  S['@I29@']=['@I163@'];
  S['@I163@']=['@I29@'];
  P['@I164@']=['@I29@','@I163@'];
  P['@I165@']=['@I29@','@I163@'];

  window.GEDCOM_PARENTS=P;
  window.GEDCOM_SPOUSES=S;
  window.render?.();
})();