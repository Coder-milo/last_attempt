export function validateInputs(...inputs) {
  return inputs.every(input => input !== null && input !== undefined && input.trim() !== '');
};
export function validatePassword(pass) {
  const tieneMayuscula = /[A-Z]/.test(pass); 
  const tieneMinuscula = /[a-z]/.test(pass);
  const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  const longitudMinima = pass.length >= 6;

  return tieneMayuscula && tieneMinuscula &&
         tieneCaracterEspecial && longitudMinima;
};

 export const acceptedTerms = (termsChecked) => {
    return termsChecked === true;
    };


    export const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(String(value).trim());
    };

    export const isValidName = (name) => {
    return typeof name === "string" && name.trim().length > 0;
    };
