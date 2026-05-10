from models.simulation import Scenario, Effect, TimelineTick, Trigger


def generate_mock_scenarios():
    return [
        Scenario(
            id="scenario-1",
            title="Aurora Latency Spike",
            severity="High",
            trigger=Trigger(node="aurora-1", type="latency_spike"),
            summary="Aurora latency propagates upstream causing ECS retry storms and elevated ALB latency.",
            timeline=[
                TimelineTick(
                    tick=0,
                    effects=[
                        Effect(
                            node="aurora-1",
                            state="degraded",
                            latency=250,
                            errors=0.02,
                        )
                    ],
                ),
                TimelineTick(
                    tick=5,
                    effects=[
                        Effect(
                            node="ecs-a",
                            state="degraded",
                            latency=420,
                            errors=0.10,
                        ),
                        Effect(
                            node="ecs-b",
                            state="degraded",
                            latency=390,
                            errors=0.09,
                        ),
                    ],
                ),
                TimelineTick(
                    tick=10,
                    effects=[
                        Effect(
                            node="alb-1",
                            state="failing",
                            latency=800,
                            errors=0.22,
                        )
                    ],
                ),
                TimelineTick(
                    tick=15,
                    effects=[
                        Effect(
                            node="cloudfront-1",
                            state="degraded",
                            latency=1200,
                            errors=0.31,
                        )
                    ],
                ),
            ],
        ),
        Scenario(
            id="scenario-2",
            title="SQS Backpressure",
            severity="Medium",
            trigger=Trigger(node="sqs-1", type="queue_congestion"),
            summary="Queue congestion delays Lambda processing but isolates the primary request path.",
            timeline=[
                TimelineTick(
                    tick=0,
                    effects=[
                        Effect(
                            node="sqs-1",
                            state="degraded",
                            latency=600,
                            errors=0.01,
                        )
                    ],
                ),
                TimelineTick(
                    tick=6,
                    effects=[
                        Effect(
                            node="lambda-1",
                            state="degraded",
                            latency=950,
                            errors=0.08,
                        )
                    ],
                ),
            ],
        ),
    ]