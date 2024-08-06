export const validatePassword = (value) => {
    const minLength = 6;
    const hasCapitalLetter = /[A-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  
    if (value.length < minLength) {
      return "Password must be at least 6 characters long.";
    } else if (!hasCapitalLetter.test(value)) {
      return "Password must contain at least one uppercase letter.";
    } else if (!hasNumber.test(value)) {
      return "Password must contain at least one number.";
    } else if (!hasSpecialChar.test(value)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };
  