const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const OTPAuth = require('otpauth');
const QRCode = require('qrcode');
const Util = require('../util');
function AuthenticationController() {
    this.login = async function login(username, password) {
        let poolData = {
            UserPoolId : 'us-east-1_CJmKMk0Fw',
            ClientId : '1alsnsg84noq81e7f2v5vru7m7'
        };
        let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        let userData = {
            Username : username,
            Pool : userPool
        };
        let authenticationData = {
            Username : username,
            Password : password,
        };
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                let idToken = result.getIdToken();
                console.log('jwt id token');
                console.log(idToken.getJwtToken());
                let accessToken = result.getAccessToken();
                console.log('access token');
                console.log(accessToken);
                let jwtToken = accessToken.getJwtToken();
                console.log(jwtToken);
            },
            onFailure: function(err) {
                console.log('failed to authenticate');
                console.log(err);
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                console.log(userAttributes);
                console.log(requiredAttributes);

                let newPassword = 's_ChLcruwr3x85J';
                let newAttributes = {
                    "family_name": 'Gonzalez',
                    "given_name": 'Timothy',
                    "address": 'Blue Iris Ln'
                };

                cognitoUser.completeNewPasswordChallenge(newPassword, newAttributes,  {
                    onSuccess: function (result) {
                        console.log(result);
                    },
                    onFailure: function(err) {
                        console.log(err);
                    }
                });
            },
            mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoUser.sendMFACode(verificationCode, this);
            },
            mfaSetup: function(challengeName, challengeParameters) {
                console.log(challengeName);
                console.log(challengeParameters);
                cognitoUser.associateSoftwareToken(this);
            },
            associateSecretCode : function(secretCode) {
                console.log(secretCode);
                let totp = new OTPAuth.TOTP({
                    issuer: 'Primordial Software LLC',
                    label: username,
                    algorithm: 'SHA1',
                    digits: 6,
                    period: 30,
                    secret: secretCode
                });
                let qrCodeUrlData = totp.toString();
                console.log(qrCodeUrlData);
                QRCode.toDataURL(qrCodeUrlData,
                    { errorCorrectionLevel: 'H', mode: 'alphanumeric' },
                    function (err, url) {
                        $('#qr-code-container').append(`<img src="${encodeURI(url)}" />`);
                        setTimeout(function() {
                                var challengeAnswer = prompt('Please input the TOTP code.' ,'');
                                cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this);
                            },
                            1000);
                    });
            },
            selectMFAType : function(challengeName, challengeParameters) {
                var mfaType = prompt('Please select the MFA method.', '');
                cognitoUser.sendMFASelectionAnswer(mfaType, this);
            },
            totpRequired : function(secretCode) {
                var challengeAnswer = prompt('Please input the TOTP code.' ,'');
                cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
            }
        });
    };
}

module.exports = AuthenticationController;