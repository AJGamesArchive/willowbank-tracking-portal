// Import core UI components
import { Divider } from "primereact/divider";

// Define <Password> component props that outline the suggestions for creating a new password

// Pop-up header
export const passwordSuggestionsHeader = (
  <div className="font-bold mb-3">
    Pick a Password
  </div>
);

// Pop-up Footer
export const passwordSuggestionsFooter = (
  <>
    <Divider />
    <p className="mt-2">Suggestions</p>
    <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
    </ul>
  </>
);

// Password strength checker messages
export type PasswordStrengthMessages = {
  prompt: string;
  weak: string;
  medium: string;
  strong: string;
};
export const passwordStrengthMsgs: PasswordStrengthMessages = {
  prompt: "Type your password",
  weak: "Weak password",
  medium: "Ok password",
  strong: "Strong password!",
};