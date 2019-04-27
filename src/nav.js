exports.initNav = function (target) {
    let root = window.location.origin === 'file://'
        ? 'file:///C:/Users/peon/Desktop/projects/income-calculator'
        : 'https://timg456789.github.io/income-calculator';
    target.append(`<div class="container">
          <div class="container-fluid">
              <a class="tab-nav-item" onclick="window.location='${root}'+'/pages/accounts.html'+window.location.search;" href="#" title="accounts">
                  <span class="ac-gn-link-text">Accounts</span>
              </a>
              <a class="tab-nav-item" onclick="window.location='${root}'+'/index.html'+window.location.search;" href="#" title="budget">
                  <span class="ac-gn-link-text">Budget</span>
              </a>
              <a class="tab-nav-item" onclick="window.location='${root}'+'/balance-sheet.html'+window.location.search;" href="#" title="balance sheet">
                  <span class="ac-gn-link-text">Balance Sheet</span>
              </a>
              <a class="tab-nav-item" onclick="window.location='${root}'+'/pay-days.html'+window.location.search;" href="#" title="pay days">
                  <span class="ac-gn-link-text">Pay Days</span>
              </a>
          </div>
      </div>`);
};
