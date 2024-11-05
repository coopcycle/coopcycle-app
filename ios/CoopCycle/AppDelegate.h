#import <UserNotifications/UNUserNotificationCenter.h>
#import <Expo/Expo.h>
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <React/RCTLinkingManager.h>
#import "RNAppAuthAuthorizationFlowManager.h"

@interface AppDelegate : EXAppDelegateWrapper <RNAppAuthAuthorizationFlowManager, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate> authorizationFlowManagerDelegate;

@end
