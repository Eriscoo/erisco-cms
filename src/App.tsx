import { lazy, Suspense } from 'react'
import { useRouter, registerPrefetch } from './utils/router'
import { isLoggedIn } from './modules/auth'
import Spinner from './components/spinner'

const Home = lazy(() => import('./pages/home'))
registerPrefetch('/', () => import('./pages/home'))
const Login = lazy(() => import('./pages/login'))
registerPrefetch('/login', () => import('./pages/login'))
const Dashboard = lazy(() => import('./pages/dashboard'))
registerPrefetch('/dashboard', () => import('./pages/dashboard'))
const Posts = lazy(() => import('./pages/posts'))
registerPrefetch('/dashboard/posts', () => import('./pages/posts'))
const CreatePost = lazy(() => import('./pages/posts/create'))
registerPrefetch('/dashboard/posts/create', () => import('./pages/posts/create'))
const EditPost = lazy(() => import('./pages/posts/edit'))
registerPrefetch('/dashboard/posts/edit/:id', () => import('./pages/posts/edit'))
const PostDetail = lazy(() => import('./pages/post'))
registerPrefetch('/:slug', () => import('./pages/post'))
const Settings = lazy(() => import('./pages/settings'))
registerPrefetch('/dashboard/settings', () => import('./pages/settings'))
const Profile = lazy(() => import('./pages/profile'))
registerPrefetch('/dashboard/profile', () => import('./pages/profile'))
const Portfolio = lazy(() => import('./pages/portfolio'))
registerPrefetch('/portfolio', () => import('./pages/portfolio'))
const Contact = lazy(() => import('./pages/contact'))
registerPrefetch('/contact', () => import('./pages/contact'))
const AllPosts = lazy(() => import('./pages/all-posts'))
registerPrefetch('/posts', () => import('./pages/all-posts'))
const About = lazy(() => import('./pages/about'))
registerPrefetch('/about', () => import('./pages/about'))
const Privacy = lazy(() => import('./pages/privacy'))
registerPrefetch('/privacy-policy', () => import('./pages/privacy'))
const Terms = lazy(() => import('./pages/terms'))
registerPrefetch('/terms-and-conditions', () => import('./pages/terms'))
const NotFound = lazy(() => import('./pages/not-found'))

function App() {
  const { path, navigate } = useRouter()
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

    if (path === '/portfolio') {
      return <Portfolio navigate={navigate} />
    }

    if (path === '/contact') {
      return <Contact navigate={navigate} />
    }

    if (path === '/about') {
      return <About navigate={navigate} />
    }

    if (path === '/privacy-policy') {
      return <Privacy navigate={navigate} />
    }

    if (path === '/terms-and-conditions') {
      return <Terms navigate={navigate} />
    }

    if (path === '/posts') {
      return <AllPosts navigate={navigate} />
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
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="w-8 h-8 text-purple-400" />
        </div>
      }>
        {renderPage()}
      </Suspense>
    </>
  )
}

export default App
