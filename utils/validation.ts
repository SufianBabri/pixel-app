export function isEmailValid(input: string) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	return regex.test(input);
}

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 12;
export function isPasswordLengthValid(input: string) {
	const length = input.length;
	return length >= MIN_PASSWORD_LENGTH && length <= MAX_PASSWORD_LENGTH;
}

export const MIN_USERNAME_LENGTH = 1;
export const MAX_USERNAME_LENGTH = 128;
export function isUsernameLengthValid(input: string) {
	const length = input.length;
	return length >= MIN_USERNAME_LENGTH && length <= MAX_USERNAME_LENGTH;
}
