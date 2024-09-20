package main

import (
	pb "github.com/billzayy/api-grpc/api/grpc/go"
	"github.com/billzayy/api-grpc/internal/services"
)

func main() {
	input := []*pb.Ticket{
		{
			TicketId:       "1",
			TicketName:     "Vung Tau - Da Lat",
			TicketQuantity: 2,
			TicketSeat:     []string{"G1", "G2"},
			TicketPrice:    "$50",
			CheckIn:        "14h00 29/04/2024",
			CheckOut:       "05h00 30/04/2024",
			ClientName:     "Bill",
		},
		{
			TicketId:       "765",
			TicketName:     "Da Lat - Ho Chi Minh",
			TicketQuantity: 2,
			TicketSeat:     []string{"A1", "A2"},
			TicketPrice:    "$150",
			CheckIn:        "20h00 01/05/2024",
			CheckOut:       "08h00 02/05/2024",
			ClientName:     "Bill",
		},
	}
	services.PaymentClient(input)
}
