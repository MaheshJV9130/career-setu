'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  status: 'active' | 'inactive'
  createdAt: string
}

interface Stats {
  totalUsers: number
  totalStudents: number
  totalAdmins: number
  activeUsers: number
  inactiveUsers: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (!data.user || data.user.role !== 'admin') router.push('/login')
        else fetchData()
      } catch {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes] = await Promise.all([fetch('/api/admin/stats'), fetch(`/api/admin/users?search=${search}&page=${page}`)])
      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      setStats(statsData.stats)
      setUsers(usersData.users)
      setTotal(usersData.total)
      setPages(usersData.pages)
    } catch (error) {
      console.error('[admin-dashboard] fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' }),
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: data.user.status } : u)))
      }
    } catch (error) {
      console.error('[toggle-status]', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId))
        setTotal(total - 1)
      }
    } catch (error) {
      console.error('[delete-user]', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (stats === null) fetchData()
      else fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, page])

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-foreground">
            CareerSetu Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin Panel</span>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                router.push('/login')
              }}
              className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-2xl font-bold text-foreground mt-2">{stats.totalUsers}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground">Students</div>
              <div className="text-2xl font-bold text-foreground mt-2">{stats.totalStudents}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground">Admins</div>
              <div className="text-2xl font-bold text-foreground mt-2">{stats.totalAdmins}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-2xl font-bold text-foreground mt-2">{stats.activeUsers}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground">Inactive Users</div>
              <div className="text-2xl font-bold text-foreground mt-2">{stats.inactiveUsers}</div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Users</h2>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="px-4 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 text-foreground">{user.name}</td>
                        <td className="py-3 px-4 text-foreground">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusToggle(user.id, user.status)}
                              disabled={updating === user.id}
                              className="px-3 py-1 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded disabled:opacity-50 transition"
                            >
                              {updating === user.id ? 'Updating...' : user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="px-3 py-1 text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 rounded transition">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 border border-border rounded hover:bg-muted disabled:opacity-50 transition text-foreground"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-foreground">
                    {page} of {pages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(pages, page + 1))}
                    disabled={page === pages}
                    className="px-3 py-2 border border-border rounded hover:bg-muted disabled:opacity-50 transition text-foreground"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
