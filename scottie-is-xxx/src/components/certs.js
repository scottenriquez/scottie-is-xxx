import React from "react"
import {rhythm} from "../utils/typography"
import {StaticImage} from "gatsby-plugin-image"

const Certs = () => {
    return (
        <div>
            <div style={{
                display: `flex`,
                justifyContent: 'center',
                marginBottom: rhythm(0.25),
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
                <a href="https://www.credly.com/badges/d3007461-ab00-48f1-b6a6-514c9fd496e2/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-certified-solutions-architect-professional.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Certified Solution Architect - Professional"
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
            </div>
            <div style={{
                display: `flex`,
                justifyContent: 'center',
                marginBottom: rhythm(2),
            }}>
                <a href="https://www.credly.com/badges/76876059-afa7-4c6f-94b9-4d10e4d92dd4/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/aws-knowledge-serverless.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="AWS Knowledge: Serverless"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/ca27c82b-a97a-4cf1-b983-d59f521dc324/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/microsoft-certified-azure-fundamentals.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="Microsoft Certified: Azure Fundamentals"
                        loading="eager"
                    />
                </a>
                <a href="https://learn.microsoft.com/api/credentials/share/en-us/scottie-enriquez/22C747278A56F6D0?sharingId=CC24E71FCD34FD03">
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
                <a href="https://learn.microsoft.com/en-us/users/scottie-enriquez/credentials/696d4be304a2844e">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/microsoft-certified-azure-administrator-associate.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="Microsoft Certified: Azure Administrator Associate"
                        loading="eager"
                    />
                </a>
                <a href="https://learn.microsoft.com/en-us/users/scottie-enriquez/credentials/8df39e881340424b">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/microsoft-certified-azure-solutions-architect-expert.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="Microsoft Certified: Azure Solutions Architect Expert"
                        loading="eager"
                    />
                </a>
                <a href="https://www.credly.com/badges/682c12b3-a38f-411c-90b2-084070edb59c/public_url">
                    <StaticImage
                        layout="constrained"
                        formats={["auto", "webp", "avif"]}
                        src="../images/hashicorp-certified-terraform-associate-003.png"
                        width={100}
                        height={100}
                        quality={95}
                        alt="HashiCorp Certified: Terraform Associate"
                        loading="eager"
                    />
                </a>
            </div>
        </div>
    )
}

export default Certs