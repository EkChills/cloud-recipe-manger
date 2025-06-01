import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <form action={async() => {
        "use server"
        await signIn("google", {redirectTo: "/recipes"} )
    }} className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-green-600"
            >
              <path d="M15 11h.01" />
              <path d="M11 15h.01" />
              <path d="M16 16h.01" />
              <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
              <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Recipe Manager</CardTitle>
          <CardDescription>Sign in to discover delicious recipes tailored just for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 border border-gray-300 py-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              <span>Sign in with Google</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our</p>
          <div className="flex gap-1">
            <Link href="#" className="text-green-600 hover:underline">
              Terms of Service
            </Link>
            <span>and</span>
            <Link href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
