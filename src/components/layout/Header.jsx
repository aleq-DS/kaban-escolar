import "../../styles/header.css";

import logo from "../../assets/logo/logo.svg";

function Header() {

    return (

        <header className="header">

            <div className="logo">

                <img
                    src={logo}
                    alt="SpreadsProject"
                    className="logo-image"
                />

                <div>

                    <h1>SpreadsProject</h1>

                    <span>KanbanMulti</span>

                </div>

            </div>

            <nav>

                <button className="login-button">

                    Entrar

                </button>

            </nav>

        </header>

    );

}

export default Header;