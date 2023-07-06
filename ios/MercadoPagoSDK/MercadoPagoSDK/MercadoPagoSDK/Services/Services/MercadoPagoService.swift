//
//  MercadoPagoService.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 5/2/15.
//  Copyright (c) 2015 com.mercadopago. All rights reserved.
//

import Foundation

internal class MercadoPagoService: NSObject {
    enum HeaderField: String {
        case productId = "X-Product-Id"
        case userAgent = "User-Agent"
        case contentType = "Content-Type"
        case sessionId = "X-Session-Id"
        case requestId = "X-Request-Id"
        case idempotencyKey = "X-Idempotency-Key"
        case density = "x-density"
        case language = "Accept-Language"
        case platform = "x-platform"
    }

    let MP_DEFAULT_TIME_OUT = 15.0
    let MP_DEFAULT_PRODUCT_ID = "BJEO9TFBF6RG01IIIOU0"

    var baseURL: String

    init (baseURL: String) {
        self.baseURL = baseURL
    }

    internal func request(uri: String, params: String?, body: Data?, method: HTTPMethod, headers: [String: String]? = nil, cache: Bool = true, success: @escaping (_ data: Data) -> Void,
                          failure: ((_ error: NSError) -> Void)?) {

        var requesturl = baseURL + uri

        if let params = params, !String.isNullOrEmpty(params), let escapedParams = params.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) {
            requesturl += "?" + escapedParams
        }

        var cachePolicy: URLRequest.CachePolicy = .useProtocolCachePolicy
        if cache {
            cachePolicy = .returnCacheDataElseLoad
        }

        let urlRequest = URL(string: requesturl)
        guard let url = urlRequest else {
            let error: NSError = NSError(domain: "com.mercadopago.sdk", code: NSURLErrorCannotFindHost, userInfo: nil)
            failure?(error)
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.httpBody = body
        request.cachePolicy = cachePolicy
        request.timeoutInterval = MP_DEFAULT_TIME_OUT

        request.setValue("application/json", forHTTPHeaderField: HeaderField.contentType.rawValue)
        if let sdkVersion = Bundle(for: MercadoPagoService.self).infoDictionary?["CFBundleShortVersionString"] as? String {
            let value = "PX/iOS/" + sdkVersion
            request.setValue(value, forHTTPHeaderField: HeaderField.userAgent.rawValue)
        }

        // Add session id
        request.setValue(MPXTracker.sharedInstance.getRequestId(), forHTTPHeaderField: HeaderField.requestId.rawValue)
        request.setValue(MPXTracker.sharedInstance.getSessionID(), forHTTPHeaderField: HeaderField.sessionId.rawValue)

        // Language
        request.setValue(Localizator.sharedInstance.getLanguage(), forHTTPHeaderField: HeaderField.language.rawValue)

        //Density Header
        request.setValue("xxxhdpi", forHTTPHeaderField: HeaderField.density.rawValue)

        //Product ID Header
        if headers?[HeaderField.productId.rawValue] == nil {
            request.setValue(MP_DEFAULT_PRODUCT_ID, forHTTPHeaderField: HeaderField.productId.rawValue)
        }

        // Add platform
        request.setValue(MLBusinessAppDataService().getAppIdentifier().rawValue, forHTTPHeaderField: HeaderField.platform.rawValue)

        if let headers = headers {
            for header in headers {
                request.setValue(header.value, forHTTPHeaderField: header.key)
            }
        }

        UIApplication.shared.isNetworkActivityIndicatorVisible = true

        PXServiceLayer().request(request).responseData { response in
            MercadoPagoService.debugPrint(response: response)
            UIApplication.shared.isNetworkActivityIndicatorVisible = false
            if let data = response.result.value, response.error == nil {
                success(data)
            } else if let error = response.error as NSError? {
                failure?(error)
            } else {
                let error: NSError = NSError(domain: "com.mercadopago.sdk", code: NSURLErrorCannotDecodeContentData, userInfo: nil)
                failure?(error)
            }
        }
    }
}

extension MercadoPagoService {
    static func debugPrint(response: DataResponse<Data>?) {
        guard let response = response else {
            return
        }
        #if DEBUG

        let requestStr = response.request?.description ?? "no request"
        print("--Request: \(requestStr)")

        if let headers = response.request?.allHTTPHeaderFields {
            print("--Request Headers: \(headers)")
        }

        if let body = response.request?.httpBody {
            let bodyStr = String(data: body, encoding: .utf8) ?? "no body"
            print("--Request Body: \(bodyStr)")
        }
        if let data = response.result.value, let utf8Text = String(data: data, encoding: .utf8) {
            print("--Response Data: \(utf8Text)")
        }
        print("--Error: \(String(describing: response.error))")
        #endif
    }
}
