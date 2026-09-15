import Image from "next/image"
import Link from "next/link"

const templates = [
    { slug: "template_one", name: "Template One", },
    { slug: "template_two", name: "Template Two", },
    { slug: "template_three", name: "Template Three", }
]
function Dashboard() {
    return (
        <div className="grid md:grid-cols-2 gap-5">
            {templates?.map((t) => (
                <Link href={`/template/${t.slug}`} key={t.slug} className="flex flex-col gap-3">
                    <Image
                        width={100} height={100}
                        src={"/loader-image.png"} alt="Image" className="w-full h-96"
                    />
                    <h2 className="text-center font-semibold">{t?.name}</h2>
                </Link>
            ))}

        </div>
    )
}

export default Dashboard