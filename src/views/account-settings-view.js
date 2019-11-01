exports.getCommandButtonsContainerView = function () {
    return `
      <span id="sign-in-sign-out-button" class="command-button" title="sign-in/sign-out">
          <span class="glyphicon glyphicon glyphicon-user" aria-hidden="true"></span>
      </span>
      <span id="view-raw-data-button" class="command-button" title="view raw json data">
          <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
      </span>
      <span id="account-settings-button" class="command-button" title="settings">
          <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
      </span>
      <span id="budget-download" class="command-button" title="download">
          <span class="glyphicon glyphicon-download" aria-hidden="true"></span>
      </span>`;
};

exports.getSignInView = function () {
    return `<div class="modal fade" id="sign-in-sign-out-view" role="dialog">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Profile</h2>
              </div>
              <div class="modal-body">
                  <form>
                      <div class="form-group">
                          <label for="login-username">Username</label>
                          <input type="email" class="form-control" id="login-username">
                      </div>
                      <div class="form-group">
                          <label for="login-password">Password</label>
                          <input type="password" class="form-control" id="login-password">
                      </div>
                      <div class="form-group sign-in-mfa-code-container hide">
                          <label for="budgetName">MFA Code</label>
                          <input type="text" class="form-control" id="budgetName">
                      </div>
                      <div id="qr-code-container"></div>
                  </form>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  <button id="sign-in-button" type="button" class="btn btn-primary">Sign In</button>
              </div>
          </div>
      </div>
  </div>`;
};

exports.getAccountSettingsView = function () {
    return `<div class="modal fade" id="account-settings-view" role="dialog">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Account Settings</h2>
              </div>
              <div class="modal-body">
                  <form>
                      <div class="form-group">
                          <label for="awsBucket">AWS Bucket</label>
                          <input type="email" class="form-control" id="awsBucket">
                      </div>
                      <div class="form-group">
                          <label for="budgetName">Budget Name</label>
                          <input type="text" class="form-control" id="budgetName">
                      </div>
                      <div class="form-group">
                          <label for="awsAccessKeyId">Access Key Id</label>
                          <input type="text" class="form-control" id="awsAccessKeyId">
                      </div>
                      <div class="form-group">
                          <label for="awsSecretAccessKey">Secret Access Key</label>
                          <input type="text" class="form-control" id="awsSecretAccessKey">
                      </div>
                  </form>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  <button id="account-settings-save-close-button" type="button" class="btn btn-primary">Save As &amp; Close</button>
              </div>
          </div>
      </div>
  </div>`;
};

exports.getRawDataView = function () {
    return `<div class="modal fade" id="raw-data-view" role="dialog">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Raw Data</h2>
              </div>
              <div class="modal-body">
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
          </div>
      </div>
  </div>`
};