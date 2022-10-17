// ==UserScript==
// @name         Runescape Account Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Zod & Shock
// @match        https://www.runescape.com/*
// @match        https://secure.runescape.com/*
// @match        https://accounts.google.com/signin*
// @match        https://accounts.google.com/ServiceLogin*
// @match        https://gaming.amazon.com/loot/runescape
// @match        https://mail.google.com/mail*
// @match        https://outlook.live.com/mail*
// @include      https://www.amazon.*
// @include      https://gaming.amazon.*
// @include      *account.amazon.com*
// @require      https://d3js.org/d3.v6.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// ==/UserScript==

(function() {
  'use strict'
  // Set constant values e.g. for bulk registering accounts with the same email and password
  // Uses the + method to create different emails
  //GM_setValue("register_email", "");
  //GM_setValue("new_password", "");

  function loadUI() {
      let overlayElement = d3.select('body').append("div").attr("id", "tool").style("position", "absolute").style("z-index", "100000").style("top", "94px").style("left", "0px").style("text-align", "center").style("background-color", "rgba(25, 25, 25, 0.95)").style("padding", "30px 50px").style("max-width", "500px").style("border-radius", "20px").style("box-shadow","3px 3px 3px black")
      overlayElement.append("h2").text("Runescape Account Tool").style("all", "revert").style("color", "#e1bb34").style("font-family", "cinzel").style("font-size", "26px").style("margin-top", "0").style("margin-bottom", "10px")
      let usernameInput = overlayElement.append("input").attr("id", "username").attr("placeholder", "username").on("input", checkUsername).style("all", "revert").style("width", "177px").style("font-size", "13px")
      let passwordInput = overlayElement.append("input").attr("id", "password").attr("placeholder", "password").style("all", "revert").style("width", "177px").style("font-size", "13px")
      overlayElement.append("h3").attr("id", "redeem_type_header").text("Membership").style("all", "revert").style("color", "#e1bb34").style("font-family", "cinzel").style("font-size", "16px").style("margin-bottom", "5px")
      let membershipCodeInput = overlayElement.append("input").attr("id", "membership_code").attr("placeholder", "membership code").style("all", "revert").style("width", "362px").style("font-size", "13px")
      let primeLoginInput = overlayElement.append("input").attr("id", "prime_login").attr("placeholder", "prime login").style("all", "revert").style("width", "362px").style("font-size", "13px")
      overlayElement.append("br")
      let membershipCheckbox = overlayElement.append("input").attr("type", "checkbox").attr("id", "membership_checkbox").style("all", "revert").style("vertical-align", "middle")
      overlayElement.append("label").attr("for", "membership_checkbox").text("Only use when no active membership or is running out in less than ").style("all", "revert").style("vertical-align", "middle")
      let membershipCondition = overlayElement.append("input").attr("id", "membership_days_count").style("all", "revert").style("width", "12px").style("font-size", "9px").style("padding", "0").style("height", "9px").style("vertical-align", "middle").style("text-align", "center")
      overlayElement.append("label").attr("for", "membership_checkbox").text(" day(s)").style("all", "revert").style("vertical-align", "middle").style("font-size", "9px")
      overlayElement.append("h3").text("Edit account data").style("all", "revert").style("color", "#e1bb34").style("font-family", "cinzel").style("font-size", "16px").style("margin-bottom", "5px")
      let registerEmailInput = overlayElement.append("input").attr("id", "register_email").attr("placeholder", "new register email").style("all", "revert").style("width", "362px").style("font-size", "13px")
      let newPasswordInput = overlayElement.append("input").attr("id", "new_password").attr("placeholder", "new password").style("all", "revert").style("width", "177px").style("font-size", "13px")
      let newDisplaynameInput = overlayElement.append("input").attr("id", "new_displayname").attr("placeholder", "new displayname").style("all", "revert").style("width", "177px").style("font-size", "13px")
      overlayElement.append("input").attr("type", "submit").attr("value", "Submit single account").attr("id", "submit_account").on("click", start).style("all", "revert").style("width", "370px")
      let checkboxWrapper = overlayElement.append("div").style("position", "absolute").style("right", "10px").style("top", "10px").style("height", "20px").style("margin", "auto")
      checkboxWrapper.append("label").attr("for", "bulk").text("Bulk").style("all", "revert").style("vertical-align", "middle")
      let bulkCheckbox = checkboxWrapper.append("input").attr("type", "checkbox").attr("id", "bulk").on("click", toggleBulk).style("all", "revert").style("vertical-align", "middle")
      checkboxWrapper.append("label").attr("for", "prime").text("Prime").style("all", "revert").style("vertical-align", "middle")
      let primeCheckbox = checkboxWrapper.append("input").attr("type", "checkbox").attr("id", "prime").on("click", togglePrime).style("all", "revert").style("vertical-align", "middle")
      let bulkAreaElement = overlayElement.append("div").attr("id", "bulk_area").style("all", "revert").style("display", "none").style("width", "510px").style("height", "295px").style("background-color", "rgba(25, 25, 25, 0.95)").style("position", "absolute").style("left", "605px").style("top", "0").style("border-radius", "20px").style("box-shadow","3px 3px 3px black")
      let bulkAreaRegisterEmail = bulkAreaElement.append("input").attr("id", "bulk_email").attr("placeholder", "bulk email").style("all","revert").style("width", "250px").style("margin", "20px 0 0 20px")
      let bulkAreaNewPassword = bulkAreaElement.append("input").attr("id", "bulk_password").attr("placeholder", "bulk password").style("all","revert").style("width", "200px").style("margin", "20px 20px 0 0")
      let bulkAreaText = bulkAreaElement.append("textarea").attr("id", "bulk_area_text").style("all", "revert").style("height", "202px").style("width", "460px").style("margin", "0 20px 0 20px").attr("placeholder", "username:password:new displayname(optional)\nusername:password:new displayname(optional)\nusername:password:new displayname(optional)\n ").style("font-size", "12px")
      bulkAreaElement.append("input").attr("type", "submit").on("click", startBulk).style("all", "revert").style("width", "466px").attr("value", "Run bulk list")
      let membershipAreaElement = overlayElement.append("div").attr("id", "membership_area").style("all", "revert").style("display", "none").style("width", "510px").style("height", "295px").style("background-color", "rgba(25, 25, 25, 0.95)").style("position", "absolute").style("left", "1120px").style("top", "0").style("border-radius", "20px").style("box-shadow","3px 3px 3px black")
      membershipAreaElement.append("h3").text("Membership codes").style("all", "revert").style("color", "#e1bb34").style("font-family", "cinzel").style("font-size", "16px").style("margin-bottom", "5px")
      let membershipAreaText = membershipAreaElement.append("textarea").attr("id", "membership_area_text").style("all", "revert").style("height", "202px").style("width", "460px").style("margin", "0 20px 0 20px").attr("placeholder", "membership code\nmembership code\nmembership code\n").style("font-size", "12px")
      let primeAreaElement = overlayElement.append("div").attr("id", "prime_area").style("all", "revert").style("display", "none").style("width", "510px").style("height", "295px").style("background-color", "rgba(25, 25, 25, 0.95)").style("position", "absolute").style("left", "1120px").style("top", "0").style("border-radius", "20px").style("box-shadow","3px 3px 3px black")
      primeAreaElement.append("h3").text("Prime logins").style("all", "revert").style("color", "#e1bb34").style("font-family", "cinzel").style("font-size", "16px").style("margin-bottom", "5px")
      let primeAreaText = primeAreaElement.append("textarea").attr("id", "prime_area_text").style("all", "revert").style("height", "202px").style("width", "460px").style("margin", "0 20px 0 20px").attr("placeholder", "username:password\nusername:password\nusername:password\n ").style("font-size", "12px")

      if(GM_getValue("username")) {
          usernameInput.attr("value", GM_getValue("username"))
      }
      if(GM_getValue("password")) {
          passwordInput.attr("value", GM_getValue("password"))
      }

      if(GM_getValue("prime")) {
          document.getElementById("prime").checked = true
          primeLoginInput.style("display", "inline-block")
          membershipCodeInput.style("display", "none")
          if(GM_getValue("prime_login")) {
              primeLoginInput.attr("value", GM_getValue("prime_login"))
          }
      } else {
          document.getElementById("prime").checked = false
          primeLoginInput.style("display", "none")
          membershipCodeInput.style("display", "inline-block")
          if(GM_getValue("membership_code")) {
              membershipCodeInput.attr("value", GM_getValue("membership_code"))
          }
      }
      console.log(GM_getValue("bulk"))
      console.log(GM_getValue("prime"))

      if(GM_getValue("membership_checkbox")) {
          document.getElementById("membership_checkbox").checked = true
      } else {
          document.getElementById("membership_checkbox").checked = false
      }

      if(GM_getValue("membership_days_count")) {
          membershipCondition.attr("value", GM_getValue("membership_days_count"))
      }
      if(GM_getValue("register_email")) {
          registerEmailInput.attr("value", GM_getValue("register_email"))
      }
      if(GM_getValue("new_password") && GM_getValue("new_password") !== GM_getValue("password")) {
          newPasswordInput.attr("value", GM_getValue("new_password"))
      }
      if(GM_getValue("new_displayname")) {
          newDisplaynameInput.attr("value", GM_getValue("new_displayname"))
      }
      if(GM_getValue("bulk")) {
          // Bulk is true
          document.getElementById("bulk").checked = true
          document.getElementById("bulk_area").style.display = "inline-block"

          if(GM_getValue("prime")) {
              // Bulk is true and prime is true
              primeAreaElement.style.display = "inline-block"
          } else {
              // Bulk is true and prime is false
              membershipAreaElement.style.display = "inline-block"
          }
      } else {
          // Bulk is false
          document.getElementById("bulk").checked = false
          bulkAreaElement.style.display = "none"
          membershipAreaElement.style.display = "none"
          primeAreaElement.style.display = "none"
      }

      if(GM_getValue("bulk_email")) {
          bulkAreaRegisterEmail.attr("value", GM_getValue("bulk_email"))
      }
      if(GM_getValue("bulk_password")) {
          bulkAreaNewPassword.attr("value", GM_getValue("bulk_password"))
      }
      if(GM_getValue("accounts")) {
          document.getElementById("bulk_area_text").innerHTML = GM_getValue("accounts")
      }
  }

  function toggleBulk() {
      let bulkAreaElement = document.getElementById("bulk_area")
      let primeAreaElement = document.getElementById("prime_area")
      let membershipAreaElement = document.getElementById("membership_area")

      if(bulkAreaElement.style.display === "none") {
          // Bulk area is not shown, show bulk area
          bulkAreaElement.style.display = "inline-block"
          primeAreaElement.style.display = "inline-block"
          membershipAreaElement.style.display = "inline-block"
          GM_setValue("bulk", true)

          if(document.getElementById("prime").checked) {
              // Bulk area is not shown and prime is checked, show bulk area with prime area
              primeAreaElement.style.display = "inline-block"
              membershipAreaElement.style.display = "none"
          } else {
              // Bulk area is not shown and prime is not checked, show bulk area without prime (so with membership codes area)
              primeAreaElement.style.display = "none"
              membershipAreaElement.style.display = "inline-block"
          }
      } else {
          // Bulk area is shown, hide bulk area and the prime & membership codes area
          bulkAreaElement.style.display = "none"
          primeAreaElement.style.display = "none"
          membershipAreaElement.style.display = "none"
          GM_setValue("bulk", false)
      }
  }

  function togglePrime() {
      // Change membership code to prime login
      let membershipCodeInput = document.getElementById("membership_code")
      let primeLoginInput = document.getElementById("prime_login")
      if(GM_getValue("prime")) {
          membershipCodeInput.style.display = "inline-block"
          primeLoginInput.style.display = "none"
          GM_setValue("prime", false)
      } else {
          primeLoginInput.style.display = "inline-block"
          membershipCodeInput.style.display = "none"
          GM_setValue("prime", true)
      }

      if(GM_getValue("bulk")) {
          // Bulk checkbox is on so open the bulk prime area
          let primeAreaElement = document.getElementById("prime_area")
          let membershipAreaElement = document.getElementById("membership_area")
          let redeemTypeHeader = document.getElementById("redeem_type_header")

          if(GM_getValue("prime")) {
              primeAreaElement.style.display = "inline-block"
              membershipAreaElement.style.display = "none"
              redeemTypeHeader.innerHTML = 'Prime Login'
          } else {
              primeAreaElement.style.display = "none"
              membershipAreaElement.style.display = "inline-block"
              redeemTypeHeader.innerHTML = 'Membership Code'
          }
      } else {
      }

  }

  function checkUsername() {
      // Check if username contains ":" then moves second part to password
      let username = document.getElementById("username").value
      if(username.indexOf(":") > -1) {
          document.getElementById("username").value = username.split(":")[0]
          document.getElementById("password").value = username.split(":")[1]
      }
  }

  function start() {
      if(GM_getValue("waiting_for_password_change") && GM_getValue("password") !== document.getElementById("password")) {
          // Script is still waiting for a password change confirmation of the previous editted account, new login password differs from the old one. Notify user!
          if (confirm('The password of the previous account you editted is not confirmed yet via your email client. Do you still want to continue?')) {
              fillStartData()
          } else {
              // Go to email client
              redirectToEmailClient()
          }
      } else {
          fillStartData()
      }
  }

  function startBulk() {
      // Save all given data in the bulk area
      GM_setValue("accounts", document.getElementById("bulk_area_text").value)
      GM_setValue("bulk_email", document.getElementById("bulk_email").value)
      GM_setValue("bulk_password", document.getElementById("bulk_password").value)

      checkBulk()
  }

  function fillStartData() {
      // Set waiting for password confirmation to false
      GM_setValue("waiting_for_password_change", false)

      // Save all given data
      GM_setValue("username", document.getElementById("username").value)
      GM_setValue("password", document.getElementById("password").value)
      GM_setValue("membership_code", document.getElementById("membership_code").value)

      let primeLogin = document.getElementById("prime_login").value
      if(primeLogin) {
          GM_setValue("prime_username", primeLogin.split(":")[0])
          GM_setValue("prime_password", primeLogin.split(":")[1])
      } else {
          GM_setValue("prime_login", "")
          GM_setValue("prime_username", "")
          GM_setValue("prime_password", "")
      }

      GM_setValue("membership_checkbox", document.getElementById("membership_checkbox").checked)
      GM_setValue("membership_days_count", document.getElementById("membership_days_count").value)
      GM_setValue("register_email", document.getElementById("register_email").value)
      GM_setValue("new_password", document.getElementById("new_password").value)
      GM_setValue("new_displayname", document.getElementById("new_displayname").value)

      // Error handling
      if(GM_getValue("username") && GM_getValue("password")) {
          // Username and password filled in
          if(GM_getValue("prime") && GM_getValue("prime_username") && GM_getValue("prime_password") ) {
              window.open("https://gaming.amazon.com/loot/runescape", "_self")
          } else {
              window.open("https://secure.runescape.com/m=weblogin/loginform?theme=runescape&mod=www&ssl=1&dest=community", "_self")
          }
      } else {
          // Username or password not filled in (Error handling)
          if(GM_getValue("username") === undefined || GM_getValue("username") === '') {
              d3.select("#username").style("background-color", "#F28B88")
          }
          if(GM_getValue("password") === undefined || GM_getValue("password") === '') {
              d3.select("#password").style("background-color", "#F28B88")
          }
      }
  }

  function checkBulk() {
      if(GM_getValue("bulk") && GM_getValue("accounts") && !GM_getValue("membership_code") && !GM_getValue("register_email") && !GM_getValue("new_password") && !GM_getValue("new_displayname")) {
      console.log('check')
          // Time for a new account
          let firstAccountRow = GM_getValue("accounts").split("\n")[0]

          document.getElementById("username").setAttribute("value", firstAccountRow.split(":")[0])
          document.getElementById("password").setAttribute("value", firstAccountRow.split(":")[1])
          //document.getElementById("membership_code").setAttribute("value", firstAccountRow.split(":")[2] || "")
          document.getElementById("new_displayname").setAttribute("value", firstAccountRow.split(":")[2] || "")

          document.getElementById("register_email").setAttribute("value", GM_getValue("bulk_email"))
          document.getElementById("new_password").setAttribute("value", GM_getValue("bulk_password"))

          // Remove account from bulk list
          GM_setValue("accounts", GM_getValue("accounts").replace(firstAccountRow+"\n", ""))

          document.getElementById("submit_account").click()
      }
  }

  function login() {
      document.getElementById("login-username").setAttribute("value", GM_getValue("username"))
      document.getElementById("login-password").setAttribute("value", GM_getValue("password"))

      if(document.getElementsByClassName("m-callout--type-error")[0] || !GM_getValue("password")) {
          let new_password = prompt("Password is not filled in or incorrect, enter the correct password", GM_getValue("password"))
          if(new_password) {
              GM_setValue("password", new_password)
              location.reload();
          } else {
              GM_setValue("password", "")
              window.open("https://www.runescape.com/", "_self")
              //location.reload();
          }
      }

      $("#rs-login-submit").click()
      $("#du-login-submit").click()
  }

  function registerEmail() {
      if(GM_getValue("register_email") !== undefined && GM_getValue("register_email") !== '') {
          // Register email is given with the start data
          // Fill in register email and redirect to mail client
          let usernameFirstPart = GM_getValue("username").split("@")[0]
          let registerEmailFirstPart = GM_getValue("register_email").split("@")[0]
          let registerEmailProvider = GM_getValue("register_email").split("@")[1]
          let createdRegisterEmail = registerEmailFirstPart+"+"+usernameFirstPart+"@"+registerEmailProvider;

          GM_setValue("register_email", "");

          document.getElementById("your-email").setAttribute("value", createdRegisterEmail)
          document.getElementById("confirm-email").setAttribute("value", createdRegisterEmail)
          document.getElementById("agree-terms-privacy").checked = true
          $("#register-email").click()
      }
  }

  function changeExistingEmail() {
      if(GM_getValue("register_email") !== undefined && GM_getValue("register_email") !== '') {
          // Register email is given with the start data
          // Fill in register email and redirect to mail client
          let usernameFirstPart = GM_getValue("username").split("@")[0]
          let registerEmailFirstPart = GM_getValue("register_email").split("@")[0]
          let registerEmailProvider = GM_getValue("register_email").split("@")[1]
          let createdRegisterEmail = registerEmailFirstPart+"+"+usernameFirstPart+"@"+registerEmailProvider;

          GM_setValue("register_email", "");

          document.getElementById("new_address1").setAttribute("value", createdRegisterEmail)
          document.getElementById("new_address2").setAttribute("value", createdRegisterEmail)
          document.querySelectorAll("[data-test='confirm']")[0].click()
      }
  }

  function changeDisplayname() {
      if(GM_getValue("new_displayname") !== undefined && GM_getValue("new_displayname") !== '') {
          // New display name is given with the start data
          document.getElementById("character-name").value = GM_getValue("new_displayname")
          const ke = new KeyboardEvent('keydown', {
              bubbles: true, cancelable: true, keyCode: 13
          });
          document.getElementById("set-btn").disabled = false;
          document.getElementById("set-btn").click()
      }
      setTimeout(() => {
          const ke = new KeyboardEvent('keydown', {
              bubbles: true, cancelable: true, keyCode: 13
          });
          document.body.dispatchEvent(ke);
          document.getElementById("set-btn").click()
      }, 2000)
      $("#set-btn").on("click", () => setTimeout(() => {
          $("#name-submit").click()
      }, 2500))
  }

  function changePassword() {
      let newPassword = GM_getValue("new_password")
      if(document.getElementById("password1")) {
          document.getElementById("password1").setAttribute("value", newPassword);
          document.getElementById("password2").setAttribute("value", newPassword);
          document.querySelectorAll("[data-test='change-password']")[0].click();

          GM_setValue("password", newPassword);
          GM_setValue("new_password", "");
          GM_setValue("waiting_for_password_change", false)
      } else {
          document.querySelectorAll("[data-test='back-to-account']")[0].click();
      }
  }

  function checkRemainingMembershipDays() {
      let membershipEndDate = document.querySelectorAll("h3.FlatHeader")[0].innerText.replace('Member until ','').split(" ")[0]
      let membershipEndTime = document.querySelectorAll("h3.FlatHeader")[0].innerText.replace('Member until ','').split(" ")[1]

      // Calculate the amount of days the membership expires
      let membershipEndDateObject = new Date(membershipEndDate.split("-")[2], "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(membershipEndDate.split("-")[1]) / 3, membershipEndDate.split("-")[0], membershipEndTime.split(":")[0], membershipEndTime.split(":")[1])
      let membershipDays = (new Date - membershipEndDateObject) / (1000 * 3600 * 24)
      return (-membershipDays)
  }

  function redeemMembershipCode() {
      if(document.getElementsByClassName("bad")[0].innerText.length !== 0) {
          // Membership code gives error
          let new_membership_code = prompt("Enter valid membership code", GM_getValue("membership_code"))
          if(new_membership_code == null || new_membership_code == "") {
              GM_setValue("membership_code", "")
              window.open("https://www.runescape.com/account_settings", "_self")
          } else if(new_membership_code.length >= 24) {
              GM_setValue("membership_code", new_membership_code)
              location.reload();
          }
      }

      document.getElementById("voucherCode").setAttribute("value", GM_getValue("membership_code"))
      $("#packageName5852").click()
      $("#redeemButton").click()
  }

  function endRedeemMembershipCode() {
      GM_setValue("membership_code", "");
      window.open("https://payments.jagex.com/logout","_self")
  }

  function redirectToEmailClient() {
      // Find email provider by spliting on @ and redirect to client
      switch (GM_getValue("register_email").split("@")[1]) {
          case "gmail.com":
              window.open("https://mail.google.com/mail/u/0")
              break
          case "outlook.com":
              window.open("https://outlook.live.com/mail/0/inbox")
              break
      }
  }

  function primeLogin() {
      setTimeout(function(){
          document.getElementById("ap_email").setAttribute("value", GM_getValue("prime_username"))
          document.getElementById("ap_password").setAttribute("value", GM_getValue("prime_password"))
          document.getElementById("signInSubmit").click()
      }, 500);
  }

  function redeemPrime() {
      setTimeout(function(){
          document.querySelector("[data-a-target='LootCardImageContainer']").click()
      }, 2000);
      setTimeout(function(){
          document.querySelector("[data-test-selector='CallToAction']").click()
      }, 2500);
      setTimeout(function(){
          document.querySelector("[data-test-selector='CallToAction']").click()
      }, 3000);
  }

  function consentAmazon() {
      setTimeout(function(){
          document.querySelector("[aria-labelledby='lwa-aui-page-button-allow-announce']").click()
          window.open("https://www.runescape.com/community");
          GM_setValue("prime_username", "")
          GM_setValue("prime_password", "")
      }, 1000);
  }

  function logoutPrime() {
      setTimeout(function(){
          document.querySelector("[data-a-target='amazon-dropdown-header-interactable']").click()
      }, 1500);

      setTimeout(function(){
          document.querySelector("[data-a-target='user-dropdown__sign-out']").click()
      }, 2000);
  }

  // ROUTER
  if(location.href.indexOf('https://gaming.amazon.com/loot/runescape') > -1) {
      // Sign in page, redeem page or complete claim page
      setTimeout(function(){
          // Complete claim page
          console.log(document.querySelector("[data-a-target='gms-success-modal-header']"))
          if(document.querySelector("[data-a-target='gms-success-modal-header']") || !GM_getValue("prime_username") && !GM_getValue("prime_password")) {
              // Claim successfully finished
              logoutPrime()
              window.open("https://www.runescape.com/community", "_self");
          } else {
              if (document.querySelector("[data-a-target='user-dropdown-first-name-text']")) {
                  // Logged in
                  setTimeout(function(){
                      document.querySelector("[data-test-selector='CallToActionText']").click()
                  }, 1000);
                  setTimeout(function(){
                      redeemPrime()
                  }, 1500);
              } else {
                  // Logged out
                  document.querySelector("[data-a-target='sign-in-button']").click()
              }
          }
      }, 1000);
      // AUTO REDIRECT AFTER 10SECS !! ONLY USE WHEN WATCHING !! !! NOT DEBUGGED 100% YET !!
      // setTimeout(function(){
      //     window.open("https://www.runescape.com/community","_self");
      // }, 10000);
  } else if(location.href.indexOf('amazon.') > -1 && location.href.indexOf('/ap/signin') > -1) {
      primeLogin()
  } else if(location.href.indexOf('account.amazon.com/ap/oa?') > -1) {
      consentAmazon()
  } else if(location.href.indexOf('https://www.runescape.com/') > -1 && location.href.indexOf('community') > -1) {
      // Runescape homepage
      if(GM_getValue("prime")) {
          loadUI()
          window.open("https://gaming.amazon.com/loot/runescape")
      } else if($("#account").length == 0) {
          // No account logged in, show UI to enter account data
          loadUI()
      } else {
          // Account is logged in, redirect to account
          document.getElementById("account").click()
      }
  } else if (location.href.indexOf('https://secure.runescape.com/m=weblogin/loginform') > -1 || location.href.indexOf('https://secure.runescape.com/m=weblogin/login-submit') > -1 || location.href.indexOf('https://secure.runescape.com/m=weblogin/oauth/') > -1) {
      // Runescape login page
      login()
  } else if (location.href.indexOf('https://secure.runescape.com/m=email-register/') > -1 && location.href.indexOf('set_address?validate=true') > -1) {
      // Runescape register email page, this page loads when an account is unregistered after loging in
      registerEmail()
  } else if (location.href.indexOf('https://secure.runescape.com/m=email-register/') > -1 && location.href.indexOf('set_address') > -1 && location.href.indexOf('set_address?validate=true') < 0 || location.href.indexOf('https://secure.runescape.com/m=email-register/') > -1 && location.href.indexOf('submit_address') > - 1) {
      // Runescape waiting for registered email page
      redirectToEmailClient()
  } else if (location.href.indexOf('https://secure.runescape.com/m=email-register/') > -1 && location.href.indexOf('/settings') > -1 || location.href.indexOf('https://secure.runescape.com/m=email-register/') > -1 && location.href.indexOf('/address_change') > -1) {
      // Runescape email and communcation preference page
      document.getElementById("change-email").click()
  } else if (location.href.indexOf('https://secure.runescape.com/m=email-register/submit_code.ws?address='+GM_getValue("register_email").split("@")[0]) > - 1 && !document.getElementById("challenge-form")) {
      // Runescape confirmation of registered email page
      window.open("https://www.runescape.com/community","_self");
  } else if (location.href.indexOf('https://secure.runescape.com/m=email-register/current_address_change_code') > - 1) {
      // Runescape change existing email page
      changeExistingEmail()
  } else if (location.href.indexOf('https://secure.runescape.com/m=email-register/new_address_change_code') > - 1) {
      // Runescape change existing email confirmation page
      window.open("https://www.runescape.com/community","_self");
  } else if (location.href.indexOf('https://www.runescape.com/') > -1 && location.href.indexOf('/account_settings') > -1) {
      // Runescape account page
      loadUI()
      if (!GM_getValue("waiting_for_password_change") && GM_getValue("new_password") && GM_getValue("new_password") !== GM_getValue("password")) {
          // New password is given and is different from the old password, request change password
          document.querySelectorAll("[data-test='change-password']")[0].click()
      } else if (document.getElementById('MyName').getElementsByClassName("G0")[0].innerText === 'No Displayname set') {
          // Displayname is not set, go to displayname change page
          document.querySelectorAll("[data-test='character-name']")[0].click()
      } else if (GM_getValue("register_email")) {
          // New Register email is filled in, go to change email page
          document.querySelectorAll("[data-test='email-and-communication']")[0].click()
      } else if (GM_getValue("membership_code").length >= 24 && !GM_getValue("prime")) {
          // Membership code is filled in, check for membership condition
          if (GM_getValue("membership_checkbox") && !GM_getValue("membership_days_count")) {
              // Only apply code when there is no active membership
              if(document.querySelectorAll("h3.FlatHeader")[0].innerText === "Currently Not a Member") {
                  window.open("https://www.runescape.com/redirect.ws?mod=billing_core&dest=voucherform.ws&ssl=1","_self");
              }
          } else if (GM_getValue("membership_checkbox") && GM_getValue("membership_days_count")) {
              // Only apply code when membership is below the given amount of days or there is no active membership
              let remainingMembershipDays = checkRemainingMembershipDays()
              if(GM_getValue("membership_days_count") < remainingMembershipDays || document.querySelectorAll("h3.FlatHeader")[0].innerText === "Currently Not a Member") {
                  window.open("https://www.runescape.com/redirect.ws?mod=billing_core&dest=voucherform.ws&ssl=1","_self");
              }
          } else {
              // Always apply code
              window.open("https://www.runescape.com/redirect.ws?mod=billing_core&dest=voucherform.ws&ssl=1","_self");
          }
      } else {
          // Check bulk list to load new account if possible
          checkBulk()
      }
  } else if (location.href.indexOf('https://secure.runescape.com/m=password_history/') > -1 && location.href.indexOf('/password-change') < 0 && location.href.indexOf('/password-start-result') < 0) {
      // Runescape password change request confirmation page
      document.querySelectorAll("[data-test='change-password']")[0].click()
      GM_setValue("waiting_for_password_change", true)
      redirectToEmailClient()
  } else if (location.href.indexOf('https://secure.runescape.com/m=password_history/') > -1 && location.href.indexOf('/password-start-result') > -1) {
      // Runescape password change request email sent page
      document.querySelectorAll("[data-test='back-to-account']")[0].click()
  } else if (location.href.indexOf('https://secure.runescape.com/m=password_history/password-change') > -1) {
      // Runescape password change page
      changePassword();
  } else if (location.href.indexOf('https://secure.runescape.com/m=displaynames') > -1 && location.href.indexOf('/name') > -1) {
      // Runescape displayname change page
      if($(".m-callout--type-success").length != 0) {
          // Displayname is changed, direct back to account page
          GM_setValue("new_displayname", "")
          document.querySelectorAll("[data-test='back-to-account-btn']")[0].click();
      } else {
          // Displayname is not changed yet, change displayname
          loadUI()
          changeDisplayname();
      }
  } else if (location.href.indexOf('https://secure.runescape.com/m=billing_core/voucherform.ws') > -1 || location.href.indexOf('https://secure.runescape.com/m=billing_core/voucherredeem.ws') > -1) {
      // Runescape membership redeem page
      redeemMembershipCode();
  } else if (location.href.indexOf('https://secure.runescape.com/m=billing_core/purchasesuccess.ws') > -1) {
      endRedeemMembershipCode();
  }
})();

//Sign in
//Country?
//document.querySelectorAll("[data-a-target="confirm-country-button"]")[0].click()
//Login

//Phone?
//document.getElementById("ap-account-fixup-phone-skip-link").click()
//Claim

//document.querySelectorAll("[data-test-selector="CallToAction"]").click() x2
//RS LOGIN
//Claim
//document.querySelectorAll("[aria-labelledby="lwa-aui-page-button-allow-announce"]").click()
//document.querySelectorAll("[data-test-selector="CallToAction"]").click()