import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Entity } from '@/lib/supabase/types'

interface RecentCustomersProps {
  customers: Entity[]
}

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No customers yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead className="text-gray-700 font-semibold">Code</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Phone</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice(0, 5).map((customer) => (
                  <TableRow key={customer.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-mono text-sm font-semibold text-black">
                      {customer.entity_code}
                    </TableCell>
                    <TableCell className="font-medium text-black">{customer.name}</TableCell>
                    <TableCell className="text-sm text-gray-700">{customer.email}</TableCell>
                    <TableCell className="text-sm text-gray-700">{customer.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className="border-gray-300 text-gray-700 bg-gray-50"
                      >
                        {customer.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
