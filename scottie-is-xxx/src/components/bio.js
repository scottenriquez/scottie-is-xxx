import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
            instagram
            gaming
          }
        }
      }
    }
  `)

  const { author } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
        I'm{" "}
        <a href="/serving/resume.pdf">
          <strong>Scottie Enriquez</strong>
        </a>
        , a Houston-based consultant, cloud solution architect, software developer, and
        volunteer high school teaching assistant. I currently work for <a href="https://www.slalom.com">Slalom</a>. I also write an{" "}
        <a href="https://micro.scottie.blog/">indie microblog</a>, a blog about{" "}
        <a href="https://scottie.codes/swift/">Swift</a>, and a blog for{" "}
        <a href="https://tryhard.football/">
          my fantasy football league
        </a>
        .
      </p>
    </div>
  )
}

export default Bio
