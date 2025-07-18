/**
 * @fileoverview gRPC-Web generated client stub for randomPackage
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v3.21.12
// source: random.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js')
const proto = {};
proto.randomPackage = require('./random_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.randomPackage.ChatServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.randomPackage.ChatServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.randomPackage.InitiateRequest,
 *   !proto.randomPackage.InitiateResponse>}
 */
const methodDescriptor_ChatService_ChatInitiate = new grpc.web.MethodDescriptor(
  '/randomPackage.ChatService/ChatInitiate',
  grpc.web.MethodType.UNARY,
  proto.randomPackage.InitiateRequest,
  proto.randomPackage.InitiateResponse,
  /**
   * @param {!proto.randomPackage.InitiateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.randomPackage.InitiateResponse.deserializeBinary
);


/**
 * @param {!proto.randomPackage.InitiateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.randomPackage.InitiateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.randomPackage.InitiateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.randomPackage.ChatServiceClient.prototype.chatInitiate =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/randomPackage.ChatService/ChatInitiate',
      request,
      metadata || {},
      methodDescriptor_ChatService_ChatInitiate,
      callback);
};


/**
 * @param {!proto.randomPackage.InitiateRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.randomPackage.InitiateResponse>}
 *     Promise that resolves to the response
 */
proto.randomPackage.ChatServicePromiseClient.prototype.chatInitiate =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/randomPackage.ChatService/ChatInitiate',
      request,
      metadata || {},
      methodDescriptor_ChatService_ChatInitiate);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.randomPackage.MessageRequest,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_ChatService_SendMessage = new grpc.web.MethodDescriptor(
  '/randomPackage.ChatService/SendMessage',
  grpc.web.MethodType.UNARY,
  proto.randomPackage.MessageRequest,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.randomPackage.MessageRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.randomPackage.MessageRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.randomPackage.ChatServiceClient.prototype.sendMessage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/randomPackage.ChatService/SendMessage',
      request,
      metadata || {},
      methodDescriptor_ChatService_SendMessage,
      callback);
};


/**
 * @param {!proto.randomPackage.MessageRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.randomPackage.ChatServicePromiseClient.prototype.sendMessage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/randomPackage.ChatService/SendMessage',
      request,
      metadata || {},
      methodDescriptor_ChatService_SendMessage);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.randomPackage.StreamRequest,
 *   !proto.randomPackage.UserStreamResponse>}
 */
const methodDescriptor_ChatService_UserStream = new grpc.web.MethodDescriptor(
  '/randomPackage.ChatService/UserStream',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.randomPackage.StreamRequest,
  proto.randomPackage.UserStreamResponse,
  /**
   * @param {!proto.randomPackage.StreamRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.randomPackage.UserStreamResponse.deserializeBinary
);


/**
 * @param {!proto.randomPackage.StreamRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.randomPackage.UserStreamResponse>}
 *     The XHR Node Readable Stream
 */
proto.randomPackage.ChatServiceClient.prototype.userStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/randomPackage.ChatService/UserStream',
      request,
      metadata || {},
      methodDescriptor_ChatService_UserStream);
};


/**
 * @param {!proto.randomPackage.StreamRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.randomPackage.UserStreamResponse>}
 *     The XHR Node Readable Stream
 */
proto.randomPackage.ChatServicePromiseClient.prototype.userStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/randomPackage.ChatService/UserStream',
      request,
      metadata || {},
      methodDescriptor_ChatService_UserStream);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.randomPackage.StreamRequest,
 *   !proto.randomPackage.StreamMessage>}
 */
const methodDescriptor_ChatService_ChatStream = new grpc.web.MethodDescriptor(
  '/randomPackage.ChatService/ChatStream',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.randomPackage.StreamRequest,
  proto.randomPackage.StreamMessage,
  /**
   * @param {!proto.randomPackage.StreamRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.randomPackage.StreamMessage.deserializeBinary
);


/**
 * @param {!proto.randomPackage.StreamRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.randomPackage.StreamMessage>}
 *     The XHR Node Readable Stream
 */
proto.randomPackage.ChatServiceClient.prototype.chatStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/randomPackage.ChatService/ChatStream',
      request,
      metadata || {},
      methodDescriptor_ChatService_ChatStream);
};


/**
 * @param {!proto.randomPackage.StreamRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.randomPackage.StreamMessage>}
 *     The XHR Node Readable Stream
 */
proto.randomPackage.ChatServicePromiseClient.prototype.chatStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/randomPackage.ChatService/ChatStream',
      request,
      metadata || {},
      methodDescriptor_ChatService_ChatStream);
};


module.exports = proto.randomPackage;

