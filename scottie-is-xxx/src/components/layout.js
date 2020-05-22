import React from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"
import scottSLogo from "../../content/assets/scott-s.svg"
import blogBLogo from "../../content/assets/blog-b.svg"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
          textAlign: `center`,
        }}
      >
        <img alt={`Scottie Enriquez`} src={scottSLogo} />
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(32),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        color: `white`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <br />
      <div style={{ textAlign: `center` }}>
        <img src={blogBLogo} alt={`Blog`} />
      </div>
    </div>
  )
}

export default Layout
