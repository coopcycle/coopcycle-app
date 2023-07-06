//
//  Alamofire+PXServiceLayer.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 9/11/18.
//

import Foundation

internal struct PXServiceLayer {
    // MARK: - Data Request

    /// Creates a `DataRequest` using the default `SessionManager` to retrieve the contents of the specified `url`,
    /// `method`, `parameters`, `encoding` and `headers`.
    ///
    /// - parameter url:        The URL.
    /// - parameter method:     The HTTP method. `.get` by default.
    /// - parameter parameters: The parameters. `nil` by default.
    /// - parameter encoding:   The parameter encoding. `URLEncoding.default` by default.
    /// - parameter headers:    The HTTP headers. `nil` by default.
    ///
    /// - returns: The created `DataRequest`.
    @discardableResult
    internal func request(
        _ url: URLConvertible,
        method: HTTPMethod = .get,
        parameters: Parameters? = nil,
        encoding: ParameterEncoding = URLEncoding.default,
        headers: HTTPHeaders? = nil)
        -> DataRequest {
            return SessionManager.default.request(
                url,
                method: method,
                parameters: parameters,
                encoding: encoding,
                headers: headers
            )
    }

    /// Creates a `DataRequest` using the default `SessionManager` to retrieve the contents of a URL based on the
    /// specified `urlRequest`.
    ///
    /// - parameter urlRequest: The URL request
    ///
    /// - returns: The created `DataRequest`.
    @discardableResult
    internal func request(_ urlRequest: URLRequestConvertible) -> DataRequest {
        return SessionManager.default.request(urlRequest)
    }
}
