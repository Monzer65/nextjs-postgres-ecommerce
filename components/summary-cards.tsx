import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">درآمد کل</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">۴۵۱۹۲۰۰ ت</div>
          <p className="text-xs text-muted-foreground">
            ۲۰.۱٪+ نسبت به ماه پیش
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">مشتریان جدید</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">۲۳۵۰+</div>
          <p className="text-xs text-muted-foreground">
            ۱۸۰.۳٪+ نسبت به ماه پیش
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">کل محصولات</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">۱۲۲۳۴</div>
          <p className="text-xs text-muted-foreground">۱۹+ امروز افزوده شده</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">رشد فروش</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">۲۵.۹٪+</div>
          <p className="text-xs text-muted-foreground">۴.۹٪+ نسبت به ماه پیش</p>
        </CardContent>
      </Card>
    </div>
  );
}
