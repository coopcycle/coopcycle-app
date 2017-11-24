//
//  STPCustomerContext.m
//  Stripe
//
//  Created by Ben Guo on 5/2/17.
//  Copyright © 2017 Stripe, Inc. All rights reserved.
//

#import "STPCustomerContext.h"

#import "STPAPIClient+Private.h"
#import "STPCustomer.h"
#import "STPEphemeralKey.h"
#import "STPEphemeralKeyManager.h"
#import "STPWeakStrongMacros.h"
#import "STPDispatchFunctions.h"

static NSTimeInterval const CachedCustomerMaxAge = 60;

@interface STPCustomerContext ()

@property (nonatomic) STPAPIClient *apiClient;
@property (nonatomic) STPCustomer *customer;
@property (nonatomic) NSDate *customerRetrievedDate;
@property (nonatomic) STPEphemeralKeyManager *keyManager;

@end

@implementation STPCustomerContext

- (instancetype)initWithKeyProvider:(nonnull id<STPEphemeralKeyProvider>)keyProvider {
    STPEphemeralKeyManager *keyManager = [[STPEphemeralKeyManager alloc] initWithKeyProvider:keyProvider
                                                                                  apiVersion:[STPAPIClient apiVersion]];
    return [self initWithKeyManager:keyManager];
}

- (instancetype)initWithKeyManager:(nonnull STPEphemeralKeyManager *)keyManager {
    self = [self init];
    if (self) {
        _keyManager = keyManager;
        [self retrieveCustomer:nil];
    }
    return self;
}

- (void)clearCachedCustomer {
    self.customer = nil;
}

- (void)setCustomer:(STPCustomer *)customer {
    _customer = customer;
    _customerRetrievedDate = (customer) ? [NSDate date] : nil;
}

- (BOOL)shouldUseCachedCustomer {
    if (!self.customer || !self.customerRetrievedDate) {
        return NO;
    }
    NSDate *now = [NSDate date];
    return [now timeIntervalSinceDate:self.customerRetrievedDate] < CachedCustomerMaxAge;
}

- (void)retrieveCustomer:(STPCustomerCompletionBlock)completion {
    if ([self shouldUseCachedCustomer]) {
        if (completion) {
            stpDispatchToMainThreadIfNecessary(^{
                completion(self.customer, nil);
            });
        }
        return;
    }
    [self.keyManager getCustomerKey:^(STPEphemeralKey *ephemeralKey, NSError *retrieveKeyError) {
        if (retrieveKeyError) {
            if (completion) {
                stpDispatchToMainThreadIfNecessary(^{
                    completion(nil, retrieveKeyError);
                });
            }
            return;
        }
        [STPAPIClient retrieveCustomerUsingKey:ephemeralKey completion:^(STPCustomer *customer, NSError *error) {
            if (customer) {
                self.customer = customer;
            }
            if (completion) {
                stpDispatchToMainThreadIfNecessary(^{
                    completion(customer, error);
                });
            }
        }];
    }];
}

- (void)attachSourceToCustomer:(id<STPSourceProtocol>)source completion:(STPErrorBlock)completion {
    [self.keyManager getCustomerKey:^(STPEphemeralKey *ephemeralKey, NSError *retrieveKeyError) {
        if (retrieveKeyError) {
            if (completion) {
                stpDispatchToMainThreadIfNecessary(^{
                    completion(retrieveKeyError);
                });
            }
            return;
        }
        [STPAPIClient addSource:source.stripeID
             toCustomerUsingKey:ephemeralKey
                     completion:^(__unused id<STPSourceProtocol> object, NSError *error) {
                         [self clearCachedCustomer];

                         if (completion) {
                             stpDispatchToMainThreadIfNecessary(^{
                                 completion(error);
                             });
                         }
                     }];
    }];
}

- (void)selectDefaultCustomerSource:(id<STPSourceProtocol>)source completion:(STPErrorBlock)completion {
    [self.keyManager getCustomerKey:^(STPEphemeralKey *ephemeralKey, NSError *retrieveKeyError) {
        if (retrieveKeyError) {
            if (completion) {
                stpDispatchToMainThreadIfNecessary(^{
                    completion(retrieveKeyError);
                });
            }
            return;
        }
        [STPAPIClient updateCustomerWithParameters:@{@"default_source": source.stripeID}
                                          usingKey:ephemeralKey
                                        completion:^(STPCustomer *customer, NSError *error) {
                                            if (customer) {
                                                self.customer = customer;
                                            }
                                            if (completion) {
                                                stpDispatchToMainThreadIfNecessary(^{
                                                    completion(error);
                                                });
                                            }
                                        }];
    }];
}

- (void)updateCustomerWithShippingAddress:(STPAddress *)shipping completion:(STPErrorBlock)completion {
    [self.keyManager getCustomerKey:^(STPEphemeralKey *ephemeralKey, NSError *retrieveKeyError) {
        if (retrieveKeyError) {
            if (completion) {
                stpDispatchToMainThreadIfNecessary(^{
                    completion(retrieveKeyError);
                });
            }
            return;
        }
        NSMutableDictionary *params = [NSMutableDictionary new];
        params[@"shipping"] = [STPAddress shippingInfoForChargeWithAddress:shipping
                                                            shippingMethod:nil];
        [STPAPIClient updateCustomerWithParameters:[params copy]
                                          usingKey:ephemeralKey
                                        completion:^(STPCustomer *customer, NSError *error) {
                                            if (customer) {
                                                self.customer = customer;
                                            }
                                            if (completion) {
                                                stpDispatchToMainThreadIfNecessary(^{
                                                    completion(error);
                                                });
                                            }
                                        }];
    }];
}

- (void)detachSourceFromCustomer:(id<STPSourceProtocol>)source completion:(STPErrorBlock)completion {
    [self.keyManager getCustomerKey:^(STPEphemeralKey *ephemeralKey, NSError *retrieveKeyError) {
        if (retrieveKeyError) {
            if (completion) {
                stpDispatchToMainThreadIfNecessary(^{
                    completion(retrieveKeyError);
                });
            }
            return;
        }

        [STPAPIClient deleteSource:source.stripeID
              fromCustomerUsingKey:ephemeralKey
                        completion:^(__unused id<STPSourceProtocol> obj, NSError *error) {
                            [self clearCachedCustomer];

                            if (completion) {
                                stpDispatchToMainThreadIfNecessary(^{
                                    completion(error);
                                });
                            }
                        }];
    }];
}

@end
