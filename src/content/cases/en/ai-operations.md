---
key: "case:ai-operations"
locale: "en"
title: "AI Agents & Model Operations | Abdullah Mansour"
description: "Daily AI costs reduced from {{metric:ai.previous-cost}} to under US${{metric:ai.cost.value}} for {{metric:ai.users.value}} people, through model selection, agent integration and team training."
heading: "From {{metric:ai.previous-cost}} to under US${{metric:ai.cost.value}} per working day."
lead: "I built a shared AI environment for {{metric:ai.users.value}} people at Tahliq, reducing daily operating costs by more than {{metric:ai.cost-reduction.value}}%. I selected and hosted models, connected them to agent tools, trained the team and resolved integration problems through fixes accepted into LocalAI."
updatedAt: "2026-10-19"
draft: false
---

## The more useful AI became, the harder its usage was to manage {#constraint}

Daily AI spending had reached {{metric:ai.previous-cost}}. As the team used agents for more work, usage limits became an operational constraint. The choices included waiting for a reset, buying additional capacity or managing growing consumption-based costs.

The work needed a way to allocate tasks that supported continued delivery and made higher-capability models available where their contribution mattered most.

## I changed how the work was allocated {#allocation}

I kept planning, difficult decisions and output supervision with the stronger models, and built a shared hosted-model path for suitable execution tasks.

I assessed options for reasoning, output quality on relevant tasks, operating requirements, image support and context length. I configured LocalAI and llama.cpp on two NVIDIA L4 GPUs, with image support and a context window of up to 256K tokens.

The purpose was to improve operating economics while retaining task selection, review and human responsibility for the work.

## I connected the model to the agents and their working environment {#integration}

I configured integration with Codex and Claude Code, putting the hosted model into the team’s execution workflow. As part of Tahliq’s wider AI setup, I also developed custom skills and MCP integrations connecting agents to their tools, and trained the team to use them.

The work required decisions about the task, the capability it needed, the model and its environment, and the tools and context available to the agent. I continued to direct execution, assess the output and address obstacles as they appeared.

## Integration exposed problems worth fixing at their source {#contributions}

### Keeping Codex and LocalAI working together

Codex exposed gaps in LocalAI's WebSocket response handling: warm-up requests needed to complete without generating output, and continuing a conversation needed its full history. Response storage also needed to keep each caller's data isolated.

I traced the problem, directed AI agents through the repair and reviewed the implementation and checks. The contribution covered warm-up handling, complete conversation continuation, response ownership and failure sequencing.

Regression tests exercised connection isolation, successive conversation turns, concurrent requests and failures during streaming. The fix, its tests and the accompanying usage documentation were accepted and merged into LocalAI.

[LocalAI compatibility contribution — #11608](https://github.com/mudler/LocalAI/pull/11608)

### Checking the guidance against actual operation

The documentation said speculative decoding was disabled when image processing was active. I checked that claim against the backend and tested a configuration combining vision input with Multi-Token Prediction (MTP).

Successful image requests and runtime logs showed both capabilities operating together. I submitted corrected guidance, the configuration example and the checks operators could use to verify their own setup. This contribution was also accepted and merged.

[LocalAI documentation correction — #11700](https://github.com/mudler/LocalAI/pull/11700)

![{{evidence:ai-localai-11608.alt}}](/media/evidence/ai-operations/01-localai-11608.png)

*A compatibility fix accepted into LocalAI, with a public record of the change and review.*

![{{evidence:ai-localai-11700.alt}}](/media/evidence/ai-operations/02-localai-11700.png)

*A documentation correction supported by practical testing and accepted upstream.*

[Selected contributions to AI tools](/resume/#open-source-contributions)

## What changed for the team {#outcome}

Daily operating costs fell from **{{metric:ai.previous-cost}} to under US${{metric:ai.cost.value}}**, a reduction of more than **{{metric:ai.cost-reduction.value}}%**, while serving **{{metric:ai.users.value}} people** through the shared environment. Stronger models remained in use for planning, supervision and harder tasks.

The project brings together several levels of my AI expertise: model selection and hosting, agent integration, task direction, output review and following a problem into the original tool when the solution requires it.

In marketing, that capability expands delivery across research, analysis, production and automation. Elkhabar Bewodooh shows another application, through the filming and publishing tools I built around its content strategy.

[Explore the media production application](/work/elkhabar-bewodooh/)

[Review my agency experience](/resume/) · [Discuss your team’s needs](/contact/)
