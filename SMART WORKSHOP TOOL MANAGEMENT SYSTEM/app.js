// ======================================================
// SMART WORKSHOP TOOL MANAGEMENT SYSTEM
// LOGIN SYSTEM V0.2
// ======================================================

// ------------------------------------------------------
// SUPABASE CONFIGURATION
// ------------------------------------------------------

const SUPABASE_URL =
    "https://tleawentwrxpqvvmmcut.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_awGWhy1V3Awozve8uSE_IQ_uliP2yGC";


// ------------------------------------------------------
// CREATE SUPABASE CLIENT
// ------------------------------------------------------

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ------------------------------------------------------
// TEST CONNECTION
// ------------------------------------------------------

console.log(
    "Smart Workshop System connected!"
);


// ------------------------------------------------------
// GET LOGIN FORM
// ------------------------------------------------------

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


// ------------------------------------------------------
// LOGIN EVENT
// ------------------------------------------------------

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ------------------------------------------
            // GET USER INPUT
            // ------------------------------------------

            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;


            // ------------------------------------------
            // CLEAR OLD MESSAGE
            // ------------------------------------------

            loginMessage.style.display = "none";

            loginMessage.textContent = "";


            // ------------------------------------------
            // VALIDATE INPUT
            // ------------------------------------------

            if (!username || !password) {

                showLoginMessage(
                    "Sila masukkan username dan password."
                );

                return;
            }


            // ------------------------------------------
            // DISABLE LOGIN BUTTON
            // ------------------------------------------

            const loginButton =
                loginForm.querySelector(
                    ".login-button"
                );

            loginButton.disabled = true;

            loginButton.textContent =
                "LOGGING IN...";


            try {

                // --------------------------------------
                // CALL SUPABASE FUNCTION
                // --------------------------------------

                const {
                    data,
                    error
                } =
                    await supabaseClient.rpc(
                        "login_user",
                        {
                            input_username:
                                username,

                            input_password:
                                password
                        }
                    );


                // --------------------------------------
                // SUPABASE ERROR
                // --------------------------------------

                if (error) {

                    console.error(
                        "Supabase Error:",
                        error
                    );

                    showLoginMessage(
                        "Ralat sistem. Cuba lagi."
                    );

                    resetLoginButton();

                    return;
                }


                // --------------------------------------
                // LOGIN FAILED
                // --------------------------------------

                if (
                    !data ||
                    data.length === 0
                ) {

                    showLoginMessage(
                        "Username atau password salah."
                    );

                    resetLoginButton();

                    return;
                }


                // --------------------------------------
                // LOGIN SUCCESS
                // --------------------------------------

                const user =
                    data[0];


                console.log(
                    "Login successful:",
                    user
                );


                // --------------------------------------
                // SAVE LOGIN SESSION
                // --------------------------------------

                const sessionData = {

                    id:
                        user.user_id,

                    username:
                        user.username,

                    role:
                        user.role,

                    full_name:
                        user.full_name

                };


                localStorage.setItem(
                    "smartWorkshopUser",
                    JSON.stringify(
                        sessionData
                    )
                );


                // --------------------------------------
                // REDIRECT BY ROLE
                // --------------------------------------

                if (
                    user.role === "admin"
                ) {

                    window.location.href =
                        "admin/dashboard.html";

                }

                else if (
                    user.role === "student"
                ) {

                    window.location.href =
                        "student/dashboard.html";

                }

                else {

                    showLoginMessage(
                        "Role pengguna tidak dikenali."
                    );

                    resetLoginButton();

                }

            }

            catch (error) {

                console.error(
                    "Unexpected error:",
                    error
                );

                showLoginMessage(
                    "Tidak dapat menghubungi server."
                );

                resetLoginButton();

            }

        }
    );

}


// ------------------------------------------------------
// SHOW LOGIN MESSAGE
// ------------------------------------------------------

function showLoginMessage(message) {

    loginMessage.textContent =
        message;

    loginMessage.style.display =
        "block";

}


// ------------------------------------------------------
// RESET LOGIN BUTTON
// ------------------------------------------------------

function resetLoginButton() {

    const loginButton =
        loginForm.querySelector(
            ".login-button"
        );

    loginButton.disabled =
        false;

    loginButton.textContent =
        "LOGIN";

}