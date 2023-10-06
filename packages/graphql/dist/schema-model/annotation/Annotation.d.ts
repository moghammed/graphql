import { AuthenticationAnnotation } from "./AuthenticationAnnotation";
import { AuthorizationAnnotation } from "./AuthorizationAnnotation";
import { CoalesceAnnotation } from "./CoalesceAnnotation";
import { CustomResolverAnnotation } from "./CustomResolverAnnotation";
import { CypherAnnotation } from "./CypherAnnotation";
import { DefaultAnnotation } from "./DefaultAnnotation";
import { FilterableAnnotation } from "./FilterableAnnotation";
import { FullTextAnnotation } from "./FullTextAnnotation";
import { IDAnnotation } from "./IDAnnotation";
import { JWTClaimAnnotation } from "./JWTClaimAnnotation";
import { JWTPayloadAnnotation } from "./JWTPayloadAnnotation";
import { KeyAnnotation } from "./KeyAnnotation";
import { LimitAnnotation } from "./LimitAnnotation";
import { MutationAnnotation } from "./MutationAnnotation";
import { PluralAnnotation } from "./PluralAnnotation";
import { PopulatedByAnnotation } from "./PopulatedByAnnotation";
import { PrivateAnnotation } from "./PrivateAnnotation";
import { QueryAnnotation } from "./QueryAnnotation";
import { RelayIDAnnotation } from "./RelayIDAnnotation";
import { SelectableAnnotation } from "./SelectableAnnotation";
import { SettableAnnotation } from "./SettableAnnotation";
import { SubscriptionAnnotation } from "./SubscriptionAnnotation";
import { SubscriptionsAuthorizationAnnotation } from "./SubscriptionsAuthorizationAnnotation";
import { TimestampAnnotation } from "./TimestampAnnotation";
import { UniqueAnnotation } from "./UniqueAnnotation";
export type Annotation =
    | CypherAnnotation
    | AuthorizationAnnotation
    | AuthenticationAnnotation
    | KeyAnnotation
    | SubscriptionsAuthorizationAnnotation
    | LimitAnnotation
    | DefaultAnnotation
    | CoalesceAnnotation
    | CustomResolverAnnotation
    | IDAnnotation
    | MutationAnnotation
    | PluralAnnotation
    | FilterableAnnotation
    | FullTextAnnotation
    | PopulatedByAnnotation
    | QueryAnnotation
    | PrivateAnnotation
    | SelectableAnnotation
    | SettableAnnotation
    | TimestampAnnotation
    | UniqueAnnotation
    | SubscriptionAnnotation
    | JWTClaimAnnotation
    | JWTPayloadAnnotation
    | RelayIDAnnotation;
export declare enum AnnotationsKey {
    authentication = "authentication",
    authorization = "authorization",
    coalesce = "coalesce",
    customResolver = "customResolver",
    cypher = "cypher",
    default = "default",
    filterable = "filterable",
    fulltext = "fulltext",
    id = "id",
    jwtClaim = "jwtClaim",
    jwtPayload = "jwtPayload",
    key = "key",
    limit = "limit",
    mutation = "mutation",
    plural = "plural",
    populatedBy = "populatedBy",
    private = "private",
    query = "query",
    selectable = "selectable",
    settable = "settable",
    subscription = "subscription",
    subscriptionsAuthorization = "subscriptionsAuthorization",
    timestamp = "timestamp",
    unique = "unique",
    relayId = "relayId",
}
export type Annotations = {
    [AnnotationsKey.cypher]: CypherAnnotation;
    [AnnotationsKey.authorization]: AuthorizationAnnotation;
    [AnnotationsKey.authentication]: AuthenticationAnnotation;
    [AnnotationsKey.key]: KeyAnnotation;
    [AnnotationsKey.subscriptionsAuthorization]: SubscriptionsAuthorizationAnnotation;
    [AnnotationsKey.limit]: LimitAnnotation;
    [AnnotationsKey.default]: DefaultAnnotation;
    [AnnotationsKey.coalesce]: CoalesceAnnotation;
    [AnnotationsKey.customResolver]: CustomResolverAnnotation;
    [AnnotationsKey.id]: IDAnnotation;
    [AnnotationsKey.mutation]: MutationAnnotation;
    [AnnotationsKey.plural]: PluralAnnotation;
    [AnnotationsKey.filterable]: FilterableAnnotation;
    [AnnotationsKey.fulltext]: FullTextAnnotation;
    [AnnotationsKey.populatedBy]: PopulatedByAnnotation;
    [AnnotationsKey.query]: QueryAnnotation;
    [AnnotationsKey.private]: PrivateAnnotation;
    [AnnotationsKey.selectable]: SelectableAnnotation;
    [AnnotationsKey.settable]: SettableAnnotation;
    [AnnotationsKey.timestamp]: TimestampAnnotation;
    [AnnotationsKey.unique]: UniqueAnnotation;
    [AnnotationsKey.subscription]: SubscriptionAnnotation;
    [AnnotationsKey.jwtClaim]: JWTClaimAnnotation;
    [AnnotationsKey.jwtPayload]: JWTPayloadAnnotation;
    [AnnotationsKey.relayId]: RelayIDAnnotation;
};
export declare function annotationToKey(ann: Annotation): keyof Annotations;
//# sourceMappingURL=Annotation.d.ts.map
