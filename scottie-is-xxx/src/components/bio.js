import React from "react"
import { rhythm } from "../utils/typography"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
    return (
        <div
            style={{
                display: `flex`,
            }}
        >
            <StaticImage
                className="bio-avatar"
                layout="fixed"
                formats={["auto", "webp", "avif"]}
                src="../images/profile-pic.png"
                width={50}
                height={50}
                quality={95}
                loading="eager"
                alt="Profile picture"
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
                , a cloud solution architect, software developer, and
                occasional nomad. I currently live in Los Angeles, California and work for <a href="https://aws.amazon.com/">Amazon Web Services</a>. I also write an{" "}
                <a href="https://micro.scottie.blog/">indie microblog</a> and a blog for{" "}
                <a href="https://tryhard.football/">
                    my fantasy football league
                </a>
                . All opinions expressed here are my own.
            </p>
        </div>
    )
}

export default Bio

