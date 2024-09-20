package repository

import (
	"context"
	"log"
	"time"

	pb "github.com/billzayy/api-grpc/api/grpc/go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ticket struct {
	TicketId       string
	TicketName     string
	TicketQuantity int32
	TicketSeat     []string // An array of seat strings
	TicketPrice    string
	CheckIn        string
	CheckOut       string
	ClientName     string
}

type Invoice struct {
	InvoiceId   primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Invoices    []*pb.Ticket
	Total       string
	PaymentDate string
}

func StorePayment(input Invoice) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)

	defer cancel()

	conn, err := ConnectMongo(ctx)

	if err != nil {
		log.Fatalf(err.Error())
	}

	defer conn.Disconnect(ctx)

	collection := conn.Database("testDB").Collection("invoices")
	_, err = collection.InsertOne(ctx, input)

	if err != nil {
		log.Fatalf(err.Error())
	}
}
