import { useRouter } from './utils/router'
import { isLoggedIn } from './modules/auth'
import Spinner from './components/spinner'
import Home from './pages/home'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Posts from './pages/posts'
import CreatePost from './pages/posts/create'
import EditPost from './pages/posts/edit'
import PostDetail from './pages/post'
import Settings from './pages/settings'
import Profile from './pages/profile'
import NotFound from './pages/not-found'

function App() {
  const { path, navigate, navigating } = useRouter()
  const loggedIn = isLoggedIn()

  function renderPage() {
    if (path === '/login') {
      if (loggedIn) {
        navigate('/')
        return null
      }
      return <Login navigate={navigate} />
    }

    if (path === '/dashboard') {
      if (!loggedIn) {
        navigate('/login')
        return null
      }
      return <Dashboard navigate={navigate} />
    }

    if (path === '/dashboard/posts/create') {
      if (!loggedIn) {
        navigate('/login')
        return null
      }
      return <CreatePost navigate={navigate} />
    }

    if (path.startsWith('/dashboard/posts/edit/')) {
      if (!loggedIn) {
        navigate('/login')
        return null
      }
      const id = Number(path.split('/').pop())
      if (isNaN(id)) return <NotFound navigate={navigate} />
      return <EditPost navigate={navigate} postId={id} />
    }

    if (path === '/dashboard/posts') {
      if (!loggedIn) {
        navigate('/login')
        return null
      }
      return <Posts navigate={navigate} />
    }

    if (path === '/dashboard/settings') {
      if (!loggedIn) {
        navigate('/login')
        return null
      }
      return <Settings navigate={navigate} />
    }

    if (path === '/dashboard/profile') {
      if (!loggedIn) {
        navigate('/login')
        return null
      }
      return <Profile navigate={navigate} />
    }

    if (path === '/') {
      return <Home navigate={navigate} />
    }

    // treat single-segment paths as post slug
    if (path.match(/^\/[^\/]+$/)) {
      const slug = path.replace('/', '')
      return <PostDetail navigate={navigate} slug={slug} />
    }

    return <NotFound navigate={navigate} />
  }

  return (
    <>
      {renderPage()}
      {navigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60">
          <Spinner className="w-8 h-8 text-purple-400" />
        </div>
      )}
    </>
  )
}

export default App
