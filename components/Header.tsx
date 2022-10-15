import React from "react";
import Link from "next/link";


export default function Header() {
    const includedPages = [
        'Silhouette', 
        'Zoom',
        'Pokedex',
        'Type',
        'Item'
    ]
    const [width, setWidth] = React.useState<any>()
    const [menuOpen, setMenuOpen] = React.useState(false)

    React.useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return (() => {
            window.removeEventListener('resize', handleResize)
        })
    }, [])

    const isMobile = width <= 768
    const createNavItems = () => includedPages.map(label => (
        <h2 
            className="nav-item" 
            key={label}
            onClick={() => setMenuOpen(false)}
        >
            <style jsx>{`
                .nav-item {
                    color: ${isMobile? '#eeeeee': 'gray'};
                    transition: .2s;
                }
                .nav-item:hover {
                    color: #eeeeee;
                    opacity: 1;
                }    
            `}</style>

            <Link
                className="link"
                href={`/Quiz/${label}`}
            >{label}</Link>
        </h2>
    ))

    return (
    <div className="Header">
        <style jsx>{`
            .Header {
                width: 100%;
                height: 100px;
                z-index: 10;
            }
            .nav-container {
                padding: 4px 30px;
                /*background-color: rebeccapurple;*/
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                display: flex;
                flex-direction: row;
                gap: 30px;
                z-index: 10;
            }

            button {
                border: none;                
            }
            .hamburger {
                margin-left: auto;
                padding: 8px;
            }

            .modal {
                position: fixed;
                left: 0; top: 0; bottom: 0; right: 0;
                display: flex; 
                flex-direction: column;
                background-color: black;
                transition: .3s;
            }
            .opened {
                transform: translateX(0%);
            }
            .closed {
                transform: translateX(100%);
            }

            .modal > button {
                align-self: flex-end;
                padding: 30px 30px;
                z-index: 5;
            }
            .mobile-menu {
                display: flex;
                flex-direction: column;
                align-items: center;
                align-self: center;
            }
        `}</style>

        <div className="nav-container"> 
            {isMobile 
            ?
                <div className="hamburger">
                    <button onClick={() => setMenuOpen(true)}>
                        <h2>
                            Menu
                        </h2>
                    </button>

                    <div className={`modal ${menuOpen? 'opened': 'closed'}`}>
                        <button
                            onClick={() => setMenuOpen(false)}
                        >X</button>
                        <div className="mobile-menu">
                            {createNavItems()}
                        </div>
                    </div>
                </div>
            :
                createNavItems()
            }
            {}
        </div>    
    </div>
    )
}