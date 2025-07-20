import { Button } from "@/components/ui/button"
import Link from "next/link"

function page() {
  return (
    <div>
        <div className="bg-neutral-300 rounded-2xl p-3 m-4">
            <div className="flex flex-row justify-between items-center">
                <h2 className="scroll-m-20 text-start p-5 text-4xl font-extrabold tracking-tight text-balance">Setting's</h2>
                <Link href="/select">
                    <Button  variant={"outline"} className="flex items-center gap-2 px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-500/30 transition-colors backdrop-blur-sm border border-white/30">
                        <span className="hidden sm:inline">Go Back</span>
                    </Button>   
                </Link>
            </div>
            <div className="bg-neutral-400 border-neutral-600 rounded-2xl p-4 m-4">
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight pb-3">Profile</h3>
                    <div className="bg-neutral-300 rounded-2xl p-3 flex flex-row justify-between items-center">
                        <h4 className="text-muted-foreground text-xl">Edit your profile</h4>
                        <Link href="/profile/edit">
                            <Button  variant={"outline"} className="flex items-center gap-2 px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-500/30 transition-colors backdrop-blur-sm border border-white/30">
                                <span className="hidden sm:inline">Edit Profile</span>
                            </Button>   
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default page

