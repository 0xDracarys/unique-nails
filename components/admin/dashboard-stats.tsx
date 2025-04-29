"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Palette, FileText, LinkIcon, TrendingUp } from "lucide-react"

interface AdminDashboardStatsProps {
  data: any
}

export default function AdminDashboardStats({ data }: AdminDashboardStatsProps) {
  const [stats, setStats] = useState({
    users: 0,
    designs: 0,
    posts: 0,
    links: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <Users className="h-8 w-8 text-amber-400" />,
      color: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-500/30",
    },
    {
      title: "Total Designs",
      value: stats.designs,
      icon: <Palette className="h-8 w-8 text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Total Posts",
      value: stats.posts,
      icon: <FileText className="h-8 w-8 text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Total Links",
      value: stats.links,
      icon: <LinkIcon className="h-8 w-8 text-green-400" />,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-6 border ${stat.borderColor} shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-purple-200/80 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-amber-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white">New user registered</p>
                <p className="text-xs text-purple-200/60">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                <Palette className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-white">New design created</p>
                <p className="text-xs text-purple-200/60">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white">New post published</p>
                <p className="text-xs text-purple-200/60">1 day ago</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-amber-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Popular Designs</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Cosmic Swirl</p>
                <p className="text-xs text-purple-200/60">24 likes</p>
              </div>
              <div className="text-amber-400 text-sm font-medium">#1</div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Galaxy Dreams</p>
                <p className="text-xs text-purple-200/60">18 likes</p>
              </div>
              <div className="text-amber-400 text-sm font-medium">#2</div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 mr-3"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Alien Superstar</p>
                <p className="text-xs text-purple-200/60">15 likes</p>
              </div>
              <div className="text-amber-400 text-sm font-medium">#3</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
