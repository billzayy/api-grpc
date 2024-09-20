package services

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	pb "github.com/billzayy/api-grpc/api/grpc/go"
	"github.com/billzayy/api-grpc/internal/repository"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func PaymentClient(input []*pb.Ticket) string {
	conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}

	c := pb.NewPaymentServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)

	defer conn.Close()

	defer cancel()

	result, err := c.PaymentProduct(ctx, &pb.TicketRequest{Ticket: input})

	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}

	log.Printf("Data: %s", result.GetMessage())

	return result.GetMessage()
}

func PaymentService(totalPrice int, input []*pb.Ticket) {
	var docs repository.Invoice

	for _, v := range input {
		docs.Invoices = append(docs.Invoices, v)
	}

	docs.Total = fmt.Sprintf("$%v", strconv.Itoa(totalPrice))
	docs.PaymentDate = time.Now().String()

	repository.StorePayment(docs)
}
