import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingDown, BookOpen, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username || 'Student'}!</h2>
        <p className="text-muted-foreground">Here is an overview of your finance and schedule.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+$12,050.00</div>
            <p className="text-xs text-muted-foreground mt-1">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">-$3,240.50</div>
            <p className="text-xs text-muted-foreground mt-1">+4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schedule Today</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Classes</div>
            <p className="text-xs text-muted-foreground mt-1">Starting at 08:00 AM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Due</CardTitle>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Tasks</div>
            <p className="text-xs text-muted-foreground mt-1">2 deadlines approaching</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '08:00 AM', course: 'Data Structures & Algorithms', room: 'A1-201' },
                { time: '10:00 AM', course: 'Calculus III', room: 'B2-104' },
                { time: '01:00 PM', course: 'Artificial Intelligence', room: 'C1-305' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-3 bg-background">
                  <div className="font-semibold text-sm w-20 shrink-0 text-primary">{item.time}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.course}</p>
                    <p className="text-xs text-muted-foreground mt-1">Room: {item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Finish AI Project', status: 'IN_PROGRESS', color: 'bg-blue-500' },
                { title: 'Submit Calculus Assignment', status: 'PENDING', color: 'bg-amber-500' },
                { title: 'Read Chapter 4 Data Structs', status: 'DONE', color: 'bg-emerald-500' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${task.color}`} />
                    <p className="text-sm font-medium">{task.title}</p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
