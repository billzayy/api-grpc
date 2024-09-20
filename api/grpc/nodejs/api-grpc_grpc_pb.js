// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var api$grpc_pb = require('./api-grpc_pb.js');

function serialize_proto_PaymentResponse(arg) {
  if (!(arg instanceof api$grpc_pb.PaymentResponse)) {
    throw new Error('Expected argument of type proto.PaymentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proto_PaymentResponse(buffer_arg) {
  return api$grpc_pb.PaymentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_proto_TicketRequest(arg) {
  if (!(arg instanceof api$grpc_pb.TicketRequest)) {
    throw new Error('Expected argument of type proto.TicketRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proto_TicketRequest(buffer_arg) {
  return api$grpc_pb.TicketRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The payment service definition.
var PaymentServiceService = exports.PaymentServiceService = {
  paymentProduct: {
    path: '/proto.PaymentService/PaymentProduct',
    requestStream: false,
    responseStream: false,
    requestType: api$grpc_pb.TicketRequest,
    responseType: api$grpc_pb.PaymentResponse,
    requestSerialize: serialize_proto_TicketRequest,
    requestDeserialize: deserialize_proto_TicketRequest,
    responseSerialize: serialize_proto_PaymentResponse,
    responseDeserialize: deserialize_proto_PaymentResponse,
  },
};

exports.PaymentServiceClient = grpc.makeGenericClientConstructor(PaymentServiceService);
