import { Calendar, Clock, Check, X } from 'lucide-react';

export default function BookingsPage() {
  const bookings = [
    {
      id: 1,
      provider: 'Ali Plumber',
      service: 'Pipe Repair',
      date: '2023-11-15',
      time: '10:00 AM',
      status: 'confirmed',
      price: '300 DH'
    },
    {
      id: 2,
      provider: 'Mohammed Electrician',
      service: 'Wiring Installation',
      date: '2023-11-17',
      time: '2:00 PM',
      status: 'pending',
      price: '450 DH'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{booking.provider}</h3>
                <p className="text-gray-600">{booking.service}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{booking.time}</span>
              </div>
              <div className="font-medium ml-auto">
                {booking.price}
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex items-center text-sm text-green-600 hover:underline">
                <Check className="h-4 w-4 mr-1" />
                Confirm Completion
              </button>
              <button className="flex items-center text-sm text-red-600 hover:underline ml-4">
                <X className="h-4 w-4 mr-1" />
                Cancel Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}