import React from "react"
import { rhythm } from "../utils/typography"
import { StaticImage } from "gatsby-plugin-image"

const Certs = () => {
    return (
        <div>
            <div style={{
                display: `flex`,
                justifyContent: 'center',
                marginBottom: rhythm(2.5),
            }}>
                <a href="https://www.credly.com/badges/a7e6b0f7-ce2a-431d-8f9f-17bad4a0cb4d/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-certified-cloud-practitioner.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Certified Cloud Practitioner"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/69072f5b-4bee-4f4b-995c-40fb05767755/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-certified-solutions-architect-associate.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Certified Solution Architect - Associate"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/a8d84cc5-1f7e-4583-9253-03c27de4ce4b/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-certified-developer-associate.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Certified Developer - Associate"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/b129d101-d04d-4a18-a2d1-57c68e309380/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-certified-sysops-administrator-associate.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Certified SysOps Administrator - Associate"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/b2c78c78-6553-4d7b-a86a-1eab958ee914/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-certified-devops-engineer-professional.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Certified DevOps Engineer - Professional"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/33179129-1e02-4f47-8a2a-013fe9b5c6b2/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/hashicorp-certified-terraform-associate.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="HashiCorp Certified: Terraform Associate"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/ff44693b-3e47-47c1-b1ff-371640144a61/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/microsoft-certified-azure-developer-associate.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="Microsoft Certified: Azure Developer Associate"
                        loading="eager"
                    />
                </a>
            </div>
        </div>
    )
}

export default Certs