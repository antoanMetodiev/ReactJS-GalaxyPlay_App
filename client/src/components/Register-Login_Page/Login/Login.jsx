import React from "react";
import styles from "./Login.module.css";
import { useForm } from "../hooks/useForm";
import backgroundVideo from "../videos/login wallper.mp4";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

export const Login = ({
	setUserDataHandler,
}) => {
	const {
		formValues,
		onChangeHandler,
		onSubmitLoginHandler,
		error,
		clearValues: cleariInputValues,
	} = useForm({
		email: "",
		password: "",
	});


	const navigate = useNavigate();
	const onClickSignUpHandler = () => navigate("/register");

	async function doLogin(event) {
		event.preventDefault();

		try {
			const result = await onSubmitLoginHandler(event);

			console.log(result);

			// Извличане на idToken от result
			const idToken = result._tokenResponse?.idToken;
			const username = result.user.displayName;
			let photoUrl = result.user.photoURL;

			if (idToken) {
				const userData = { username, photoUrl };
				setUserDataHandler(result);
				localStorage.setItem("user", JSON.stringify(userData));

				// Съхранявам сесията в JS Cookies:
				Cookies.remove('session');
				Cookies.set('session', idToken, { expires: 1, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
				navigate("/");

			} else {
				clearValues.cleariInputValues();
			}
		} catch (error) {
			clearValues.cleariInputValues();
			console.error("Login error:", error);
		}
	}

	return (
		<div className={styles["register-page-container"]}>
			<video
				autoPlay
				loop
				muted
				preload="auto"
				className={styles["video-bkg"]}
				src={backgroundVideo}
			>
				Your browser does not support the video tag.
			</video>
			<form
				onSubmit={doLogin}
				className={`${styles["register"]} ${styles["other"]}`}
			>
				<header className={styles["header"]}>
					<h1>Sign In</h1>
				</header>
				<fieldset>
					<legend>Email &amp; Password:</legend>
					<div
						className={`${styles["field"]} ${styles["text"]} ${styles["icon-username"]}`}
					>
						<input
							onChange={onChangeHandler}
							name="email"
							type="email"
							id="username"
							placeholder="Email..."
							value={formValues.email}
						/>
						<i className="fa fa-user" />
						<label htmlFor="username">Email: </label>
						<span className={styles["helper"]}>Hello there</span>
					</div>
					<div
						className={`${styles["field"]} ${styles["text"]} ${styles["icon-password"]}`}
					>
						<input
							onChange={onChangeHandler}
							name="password"
							type="password"
							id="re-password"
							placeholder="Password..."
							value={formValues.password}
						/>
						<label htmlFor="re-password">Password:</label>
						<i className="fa fa-key" />
					</div>
				</fieldset>

				<span
					onClick={onClickSignUpHandler}
					className={styles["sign-up-option"]}
				>
					Sign Up
				</span>
				<input type="submit" value="Sign In" />
			</form>

			{error === "This user does not exist." && (
				<h2 className={styles["error-message-title"]}>{error}</h2>
			)}
		</div>
	);
};
