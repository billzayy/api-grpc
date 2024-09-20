package main

import (
	"context"
	"log"
	"net"
	"os"
	"strconv"
	"time"

	pb "github.com/billzayy/api-grpc/api/grpc/go"
	"github.com/billzayy/api-grpc/internal/services"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

type service struct {
	pb.UnimplementedPaymentServiceServer
}

func (s *service) PaymentProduct(ctx context.Context, in *pb.TicketRequest) (*pb.PaymentResponse, error) {
	currentBudget := 200
	sum := 0

	for _, v := range in.Ticket {
		price, err := strconv.Atoi(v.TicketPrice[1:])

		if err != nil {
			log.Fatalf("Can not convert string into int")
			return &pb.PaymentResponse{}, err
		}

		sum += price
	}

	charging := currentBudget - sum

	if charging < 0 {
		return &pb.PaymentResponse{Message: "Your budget is not enough to pay !"}, nil
	} else {
		select {
		case <-time.After(2 * time.Second): // Simulated work (change duration as needed)
			// Your actual business logic goes here
			services.PaymentService(charging, in.Ticket)
			return &pb.PaymentResponse{Message: "Payment Successful !"}, nil
		case <-ctx.Done():
			return nil, ctx.Err() // Return error if the context is done (timeout or cancellation)
		}
	}
}

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Can't read .env file")
	}

	lis, err := net.Listen("tcp", ":"+os.Getenv("GRPC_PORT"))

	if err != nil {
		log.Fatalf(err.Error())
	}

	conn := grpc.NewServer()
	pb.RegisterPaymentServiceServer(conn, &service{})

	log.Printf("Server is listening on %v", lis.Addr())

	if err := conn.Serve(lis); err != nil {
		log.Fatalf(err.Error())
	}
}
