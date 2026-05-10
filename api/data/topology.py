from models.simulation import Node, Edge, Topology


def generate_mock_topology():
    nodes = [
        Node(
            id="cloudfront-1",
            type="cloudfront",
            label="CloudFront",
            tier="edge",
            lane="global",
            xHint=0,
        ),
        Node(
            id="alb-1",
            type="alb",
            label="Application Load Balancer",
            tier="ingress",
            lane="az-a",
            xHint=1,
        ),
        Node(
            id="ecs-a",
            type="ecs",
            label="ECS Service",
            tier="compute",
            lane="az-a",
            xHint=1,
        ),
        Node(
            id="ecs-b",
            type="ecs",
            label="ECS Worker",
            tier="compute",
            lane="az-b",
            xHint=2,
        ),
        Node(
            id="sqs-1",
            type="sqs",
            label="SQS Queue",
            tier="async",
            lane="regional",
            xHint=1,
        ),
        Node(
            id="lambda-1",
            type="lambda",
            label="Lambda",
            tier="compute",
            lane="regional",
            xHint=2,
        ),
        Node(
            id="aurora-1",
            type="aurora",
            label="Aurora DB",
            tier="data",
            lane="az-a",
            xHint=1,
        ),
        Node(
            id="dynamo-1",
            type="dynamodb",
            label="DynamoDB",
            tier="data",
            lane="regional",
            xHint=2,
        ),
    ]

    edges = [
        Edge(source="cloudfront-1", target="alb-1", mode="sync"),
        Edge(source="alb-1", target="ecs-a", mode="sync"),
        Edge(source="alb-1", target="ecs-b", mode="sync"),
        Edge(source="ecs-a", target="aurora-1", mode="sync"),
        Edge(source="ecs-b", target="aurora-1", mode="sync"),
        Edge(source="ecs-a", target="sqs-1", mode="async"),
        Edge(source="sqs-1", target="lambda-1", mode="async"),
        Edge(source="lambda-1", target="dynamo-1", mode="sync"),
    ]

    return nodes, edges


MOCK_TOPOLOGY = Topology(
    nodes=[
        Node(
            id="cloudfront-1",
            type="cloudfront",
            label="CloudFront",
            tier="edge",
            lane="global",
            xHint=0,
        ),
        Node(
            id="alb-1",
            type="alb",
            label="Application Load Balancer",
            tier="ingress",
            lane="az-a",
            xHint=1,
        ),
        Node(
            id="ecs-a",
            type="ecs",
            label="ECS API",
            tier="compute",
            lane="az-a",
            xHint=1,
        ),
        Node(
            id="ecs-b",
            type="ecs",
            label="ECS Worker",
            tier="compute",
            lane="az-b",
            xHint=2,
        ),
        Node(
            id="sqs-1",
            type="sqs",
            label="SQS Queue",
            tier="async",
            lane="regional",
            xHint=1,
        ),
        Node(
            id="lambda-1",
            type="lambda",
            label="Lambda Processor",
            tier="compute",
            lane="regional",
            xHint=3,
        ),
        Node(
            id="aurora-1",
            type="aurora",
            label="Aurora Cluster",
            tier="data",
            lane="az-a",
            xHint=1,
        ),
        Node(
            id="dynamo-1",
            type="dynamodb",
            label="DynamoDB",
            tier="data",
            lane="regional",
            xHint=3,
        ),
    ],
    edges=[
        Edge(source="cloudfront-1", target="alb-1", mode="sync"),
        Edge(source="alb-1", target="ecs-a", mode="sync"),
        Edge(source="alb-1", target="ecs-b", mode="sync"),
        Edge(source="ecs-a", target="aurora-1", mode="sync"),
        Edge(source="ecs-a", target="sqs-1", mode="async"),
        Edge(source="sqs-1", target="lambda-1", mode="async"),
        Edge(source="lambda-1", target="dynamo-1", mode="sync"),
    ],
)