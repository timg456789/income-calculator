const Util = require('./util');
exports.initNav = function (target) {
    let root = Util.rootUrl();
    target.append(`<div class="container">
          <div class="container-fluid">
              <a class="tab-nav-item" onclick="window.location='${root}'+'/index.html'+window.location.search;" href="#" title="budget">
                  <span class="ac-gn-link-text">Budget</span>
              </a>
              <a class="tab-nav-item" onclick="window.location='${root}'+'/pages/balance-sheet.html'+window.location.search;" href="#" title="balance sheet">
                  <span class="ac-gn-link-text">Balance Sheet</span>
              </a>
              <a class="tab-nav-item" onclick="window.location='${root}'+'/pages/accounts.html'+window.location.search;" href="#" title="accounts">
                  <span class="ac-gn-link-text">Accounts</span>
              </a>
              <a class="tab-nav-item" onclick="window.location='${root}'+'/pages/pay-days.html'+window.location.search;" href="#" title="pay days">
                  <span class="ac-gn-link-text">Pay Days</span>
              </a>
          </div>
      </div>`);
};
