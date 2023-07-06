//
//  PXSpruce+UIView.swift
//  Spruce
//
//  Copyright (c) 2017 WillowTree, Inc.

//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:

//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.

//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import UIKit

/// Spruce adds `UIView` extensions so that you can easily access a Spruce animation anywere. To make things
/// simple all Spruce functions are under the computed variable `spruce` or use our spruce tree emoji!
extension UIView: PXPropertyStoring {
    /// Access to all of the Spruce library animations. Use this to call functions such as `.animate` or `.prepare`
    internal var pxSpruce: PXSpruce {
        return PXSpruce(view: self)
    }

    private struct PXCustomProperties {
        static var animationEnabled: Bool = true
        static var onetapRowAnimatedEnabled: Bool = false
    }

    typealias CustomT = Bool

    var pxShouldAnimated: Bool {
        get {
            return getAssociatedObject(&PXCustomProperties.animationEnabled, defaultValue: true)
        }
        set {
            return objc_setAssociatedObject(self, &PXCustomProperties.animationEnabled, newValue, .OBJC_ASSOCIATION_RETAIN)
        }
    }

    var pxShouldAnimatedOneTapRow: Bool {
        get {
            return getAssociatedObject(&PXCustomProperties.onetapRowAnimatedEnabled, defaultValue: false)
        }
        set {
            return objc_setAssociatedObject(self, &PXCustomProperties.onetapRowAnimatedEnabled, newValue, .OBJC_ASSOCIATION_RETAIN)
        }
    }
}
