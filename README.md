angular-unique-email
====================

Checks if email is free. Useful for validation on "Sign Up" page.

Usage
-----

**Simple Example:**
```html
<form name="registerForm">
  <input type="email" name="email" ng-model="user.email" required data-unique-email="/account/:email/free">

  ...

  <button type="button" name="register-btn" ng-disabled="registerForm.$invalid">Sign Up</button>
</form>
```

**Simple Example with custom timeout after last input keyup:**
```html
<form name="registerForm">
  <input type="email" name="email" ng-model="user.email" required
         data-unique-email="/account/:email/free"  data-unique-email-timeout="1000">

  ...

  <button type="button" name="register-btn" ng-disabled="registerForm.$invalid">Sign Up</button>
</form>
```


**Display Custom Error**<br>
If your form and field both are named, you can access the validation result to show/hide messages
```html
<form name="registerForm">
  <input type="email" name="email" ng-model="user.email" required
         data-unique-email="/account/:email/free" data-unique-email-timeout="1000">
  
  <div ng-show="registerForm.email.$error.unique">Account with such e-mail alrady exists</div>

  ...

  <button type="button" name="register-btn" ng-disabled="registerForm.$invalid">Sign Up</button>
</form>
  
```

Server
------

Directive expects json { success: true|false };
